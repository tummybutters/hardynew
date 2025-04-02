import { Helmet } from 'react-helmet';
import Layout from '@/components/layout/Layout';
import AdminTools from '@/components/admin/AdminTools';

export default function Admin() {
  return (
    <Layout>
      <Helmet>
        <title>Admin - Hardy's Wash N' Wax</title>
        <meta name="description" content="Admin tools for Hardy's mobile detailing service" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Admin Dashboard
          </h1>
          
          <AdminTools />
        </div>
      </div>
    </Layout>
  );
}