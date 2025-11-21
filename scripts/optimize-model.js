#!/usr/bin/env node

const { NodeIO } = require('@gltf-transform/core');
const { ALL_EXTENSIONS } = require('@gltf-transform/extensions');
const {
    dedup,
    draco,
    textureCompress,
    resample,
    prune,
    weld,
    quantize
} = require('@gltf-transform/functions');
const draco3d = require('draco3dgltf');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimizeModel() {
    console.log('🚀 Starting model optimization...\n');

    const inputPath = path.join(__dirname, '../public/bmw_m4_f82.glb');
    const outputPath = path.join(__dirname, '../public/bmw_m4_f82_optimized.glb');
    const backupPath = path.join(__dirname, '../public/bmw_m4_f82_original.glb');

    // Check if file exists
    if (!fs.existsSync(inputPath)) {
        console.error('❌ Error: bmw_m4_f82.glb not found in public folder');
        process.exit(1);
    }

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;
    console.log(`📦 Original file size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    // Create backup if it doesn't exist
    if (!fs.existsSync(backupPath)) {
        console.log('💾 Creating backup of original file...');
        fs.copyFileSync(inputPath, backupPath);
    }

    try {
        // Initialize IO
        const io = new NodeIO()
            .registerExtensions(ALL_EXTENSIONS)
            .registerDependencies({
                'draco3d.decoder': await draco3d.createDecoderModule(),
                'draco3d.encoder': await draco3d.createEncoderModule(),
            });

        // Read the GLB file
        console.log('📖 Reading model...');
        const document = await io.read(inputPath);

        // Apply optimizations
        console.log('⚙️  Applying optimizations...');

        // 1. Remove duplicate data
        console.log('  - Removing duplicates...');
        await document.transform(dedup());

        // 2. Weld vertices
        console.log('  - Welding vertices...');
        await document.transform(weld());

        // 3. Prune unused data
        console.log('  - Pruning unused data...');
        await document.transform(prune());

        // 4. Compress with Draco
        console.log('  - Applying Draco compression...');
        await document.transform(
            draco({
                quantizePosition: 14,
                quantizeNormal: 10,
                quantizeTexcoord: 12,
                quantizeColor: 8,
                quantizeGeneric: 12,
            })
        );

        // 5. Compress textures
        console.log('  - Compressing textures...');
        await document.transform(
            textureCompress({
                encoder: sharp,
                targetFormat: 'webp',
                quality: 85,
                resize: [2048, 2048], // Max texture size
            })
        );

        // 6. Resample animations (if any)
        console.log('  - Resampling animations...');
        await document.transform(resample());

        // Write optimized file
        console.log('💾 Writing optimized model...');
        await io.write(outputPath, document);

        // Get optimized file size
        const optimizedSize = fs.statSync(outputPath).size;
        const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

        console.log('\n✅ Optimization complete!');
        console.log(`📦 Optimized file size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📉 Size reduction: ${reduction}%`);
        console.log(`\n💡 To use the optimized model, update your code to load:`);
        console.log(`   '/bmw_m4_f82_optimized.glb'`);
        console.log(`\n💾 Original file backed up to: bmw_m4_f82_original.glb`);

    } catch (error) {
        console.error('❌ Error during optimization:', error);
        process.exit(1);
    }
}

optimizeModel();
