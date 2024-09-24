import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { getProjectByName, addLogToProject } from "app/server/api/index";

export async function loader({ params }) {
  const projectName = params.projectName;
  const project = await getProjectByName(projectName);

  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ project });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const description = formData.get("description");
  const addedDate = formData.get("addedDate");
  const projectName = params.projectName;

  await addLogToProject(projectName, { description, addedDate });

  return json({ success: true });
}

export default function ProjectDetails() {
  const { project } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const actionData = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    if (actionData?.success) {
      setIsModalOpen(false);
    }
  }, [actionData]);

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl">{project.name}</h1>
            <p className="text-lg mb-4">{project.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Project Logs</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Add Log
              </button>
            </div>

            {project.logs && project.logs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {project.logs.map((log) => (
                    <div key={log._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body">
                        <p>{log.description}</p>
                        <p className="text-sm text-base-content text-opacity-60">
                          Added: {new Date(log.addedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {project.logs.length === 20 && (
                  <p className="mt-4 text-sm text-base-content text-opacity-60">
                    Showing the 20 most recent logs. There may be more logs available.
                  </p>
                )}
              </>
            ) : (
              <p className="text-base-content text-opacity-60">No logs available for this project.</p>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Add New Log</h3>
              <Form method="post">
                <div className="form-control">
                  <label className="label" htmlFor="description">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea 
                    id="description" 
                    name="description" 
                    className="textarea textarea-bordered h-24" 
                    required
                  />
                </div>
                <div className="form-control mt-4">
                  <label className="label" htmlFor="addedDate">
                    <span className="label-text">Date</span>
                  </label>
                  <input 
                    type="date" 
                    id="addedDate" 
                    name="addedDate" 
                    defaultValue={today}
                    className="input input-bordered" 
                    required
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Log"}
                  </button>
                  <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}