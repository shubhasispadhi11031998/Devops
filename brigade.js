const { events, Job } = require("brigadier");
events.on("exec", () => {
  var job = new Job("do-nothing", "alpine:3.8");
  job.tasks = [
    "echo Good gooog",
    "echo Bye"
  ];

  job.run();
});