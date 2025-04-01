import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Blog',
        href: '/blogs/create',
    },
];

type BlogForm = {
    title: string;
    content: string;
    excerpt: string;
    featured_image: string;
};
export default function CreateBlog() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<BlogForm>>({
        title: '',
        content: '',
        excerpt: '',
        featured_image: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard'), {
            onFinish: () => reset('title', 'content'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={submit} className="space-y-6">
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError className="mt-2" message={errors.title} />

                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>



                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 bg-gray-50 px-6 py-3">
                        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Blog Post'}
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
