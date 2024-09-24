import { json } from '@remix-run/node';
import { useLoaderData, useSubmit, useActionData,Form,Link } from '@remix-run/react';
import { useState, useEffect, useRef } from 'react';
import { getProjects, createProject } from 'app/server/api/index';
import toast from 'react-hot-toast';

export const loader = async () => {
  const projects = await getProjects();
  return json({ projects });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name');
  
  try {
    const newProject = await createProject(name);
    return json({ success: true, project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return json({ success: false, error: error.message }, { status: 400 });
  }
};

export default function Projects() {
  const { projects } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.success) {
      toast.success('Project created successfully!');
      setIsModalOpen(false);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Create New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {/* Modal */}
      <input type="checkbox" id="new-project-modal" className="modal-toggle" checked={isModalOpen} onChange={() => setIsModalOpen(!isModalOpen)} />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create New Project</h3>
          <Form method="POST">
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text">Project Name</span>
              </label>
              <input type="text" name="name" id="name" className="input input-bordered" required />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create Project</button>
              <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{project.name}</h2>
        <div className="card-actions justify-end mt-4">
          <Link to={`/project/${project.name}`}>
            <button className="btn btn-primary">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}