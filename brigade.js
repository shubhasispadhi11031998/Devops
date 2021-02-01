const { events, Job, Group } = require("brigadier");
events.on("push", async (e, project) => {
  var job = new Job("my-firstjob", "amitsanu/brigimagef:latest");
  job.priviliged = true;
  const project_id = project.secrets.project_id;
  let keyval = {
    type: project.secrets.type,
    project_id: project.secrets.project_id,
    private_key_id: project.secrets.private_key_id,
    private_key: project.secrets.private_key,
    client_email: project.secrets.client_email,
    client_id: project.secrets.client_id,
    auth_uri: project.secrets.auth_uri,
    token_uri: project.secrets.token_uri,
    auth_provider_x509_cert_url: project.secrets.auth_provider_x509_cert_url,
    client_x509_cert_url: project.secrets.client_x509_cert_url,
    };
    let keyvalobj = JSON.stringify(keyval);
  job.env = {
    DOCKER_DRIVER: "overlay",
    key: keyvalobj
  }
  job.tasks = [
    //authentication with gcloud
    "echo now auth",
    "gcloud version",
    "echo $key > key.json",
    "cat key.json",
    "gcloud auth activate-service-account --key-file=key.json",
    "gcloud config set project vocal-raceway-299310",
    "echo auth gcloud done",
    
    //helm authentication
    "gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project vocal-raceway-299310",
    "gcloud components install kubectl",
    "echo cluster successful",
    "helm version",
    "helm init --history-max 200",
    "helm install my-chart/",
    "echo helm installed "
  ];
  job.run();
  // jobs();
  // lint();
});

// function jobs(){
// const jobs = new Job("my-docker","nxvishal/platform_new:latest");
//   jobs.privileged = true;
//   jobs.storage.enabled = true;
//   jobs.env = {
//     DOCKER_DRIVER: "overlay"
//   };
//   jobs.tasks = [
//     // docker image pushing to gcp
//     "dockerd &",
//     "dockerd-entrypoint.sh &",
//     "gcloud auth configure-docker",
//     "docker version",
//     "docker images",
//     "docker build -t helloworld:latest",
//     "docker tag helloworld:latest gcr.io/vocal-raceway-299310/hello-world:v1",
//     "docker push gcr.io/vocal-raceway-299310/hello-world:v1",
//     "echo docker image pushed"
//   ];
//   jobs.run();
// }