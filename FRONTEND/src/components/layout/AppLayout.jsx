import { Outlet, useParams } from 'react-router-dom';
import { ProjectProvider } from '../../context/ProjectContext';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';

export const AppLayout = () => {
    const { projectId } = useParams();

    const content = (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );

    if (projectId) {
        return <ProjectProvider projectId={projectId}>{content}</ProjectProvider>;
    }

    return content;
};
