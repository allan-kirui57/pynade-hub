import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout.js';

export default function Index() {
    return (
        <AppLayout>
            <div className="mb-6 sm:flex sm:items-center sm:justify-between">
                <div className="mt-4 sm:mt-0">
                    <Link
                        href={route('blogs.create')}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Blog
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
