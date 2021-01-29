const { events, Job } = require("brigadier");
events.on("exec", async (e, project) => {
  var job = new Job("my-firstjob", "amitsanu/brigimagef:latest");
  job.priviliged = true;
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

    // //build and push docker image to gcr
    // "docker version",
    // "docker build -t helloworld:latest",
    // "docker tag helloworld:latest gcr.io/vocal-raceway-299310/hello-world:lipu",
    // "docker push gcr.io/vocal-raceway-299310/hello-world:lipu",
    // "echo docker pushed successfully"
  ];

  job.run();
});