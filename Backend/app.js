const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const dbService = require('./db_service');

const db = dbService.getDbServiceInstance();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Serve main HTML project from /Frontend
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(express.static(path.join(__dirname, '../Frontend/lib')));

// ✅ Serve built React app from /chat
app.use('/chat', express.static(path.join(__dirname, '../Frontend/chat')));

// Serve Marketplace files
app.use('/marketplace', express.static(path.join(__dirname, '../Frontend')));


// ✅ Handle React internal routes
app.get('/chat/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/chat/index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/web page/LoginRegistrationPage.html'));
});

app.use(express.static(path.join(__dirname, '../Frontend/web page')));


// app.post('/filterFriedPosts', async (req, res) => {
//     const { category } = req.body;
//     const userId = 6; // Assume this is the logged-in user's ID. You may replace it with a session-based ID.
//     const db = dbService.getDbServiceInstance();
//     try {
//         let posts;
//         if (category === 'friends') {
//             posts = db.getFriendPosts(userId);
//         } else {
//             // handle other categories or default post fetch
//             posts = db.getAllPosts(); // Or however you fetch all posts
//         }
//         res.json({ data: posts });
//     } catch (error) {
//         console.error('Error fetching filtered posts:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });




// Serve static files
app.use(express.static(path.join(__dirname, '..', 'JobHTML'))); // HTML files
app.use('/js', express.static(path.join(__dirname, '..', 'JobJS'))); // JS files

// POST endpoint to save profile

// app.post('/saveUserProfile', async (req, res) => {
//     const { user_ID, fullName, email, phone } = req.body;
  
//     if (!user_ID || !fullName || !email || !phone) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
  
//     try {
//       await db.saveUserProfile(user_ID, fullName, email, phone);
//       res.status(200).json({ message: 'Profile saved successfully' });
//     } catch (err) {
//       console.error('Database error:', err);
//       res.status(500).json({ error: 'Database error' });
//     }
//   });

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

app.post('/saveUserProfile', upload.single('cv'), async (req, res) => {
  const { user_ID, fullName, email, phone } = req.body;
  const cvBuffer = req.file ? req.file.buffer : null; // get file content buffer

  if (!user_ID || !fullName || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Save to database: pass buffer instead of filename
    await db.saveUserProfile(user_ID, fullName, email, phone, cvBuffer);

    res.status(200).json({ message: 'Profile saved successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get("/search-friends", async (req, res) => {
    const { q, userID } = req.query;
   
    try {
      const results = await db.searchFriends(userID, q);
      res.json(results);
    } catch (err) {
      console.error("Search Error:", err);
      res.status(500).json({ error: "Failed to search friends" });
    }
  });
  
  app.post("/add-to-project-team", async (req, res) => {
    const { projectID, memberID } = req.body;

    // console.log("app_ "+projectID+" "+memberID);
    try {
      await db.addMemberToProject(projectID, memberID);
      res.json({ success: true });
    } catch (err) {
      console.error("Add member error:", err);
      res.status(500).json({ success: false });
    }
  });

  app.get('/project-team', async (req, res) => {
    const { projectID } = req.query;
    if (!projectID) return res.status(400).json({ error: "projectID is required" });
  

    const team = await db.getProjectTeamMembers(projectID);
    res.json(team);
  });

  app.get("/api/tasks", async (req, res) => {
    const { projectID } = req.query;
    // const db = dbservice.getDbServiceInstance();
    const tasks = await db.getTasksByProjectID(projectID);
    res.json(tasks);
  });

  app.put("/api/tasks/:taskID", async (req, res) => {
    const { taskID } = req.params;
    const { status, assign_user_ID } = req.body;
    // const db = dbservice.getDbServiceInstance();
    const result = await db.updateTask(taskID, status, assign_user_ID);
    res.json({ success: result });
  });

  app.delete("/api/tasks/:taskID", async (req, res) => {
    const { taskID } = req.params;
    // const db = dbservice.getDbServiceInstance();
    const result = await db.deleteTask(taskID);
    res.json({ success: result });
  });

  // GET project details
app.get('/api/project/details', async (req, res) => {
    const { projectID } = req.query;
    // const db = dbservice.getDbServiceInstance();
    const details = await db.getProjectDetails(projectID);
    res.json(details);
  });
  
  // GET task status counts
  app.get('/api/project/task-status', async (req, res) => {
    const { projectID } = req.query;
    // const db = dbservice.getDbServiceInstance();
    const counts = await db.getTaskStatusCounts(projectID);
    res.json(counts);
  });
  
  
  
  
  
  


app.get('/api/jobs', async (req, res) => {
    try {
      const userId = req.query.userID;
      if (!userId) return res.status(400).json({ error: 'User ID is required' });
  
      const jobs = await db.getJobsByUser(userId);
      res.json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/add-task', async (req, res) => {
    const { project_ID, task_name, assign_user_ID, task_details, status } = req.body;
  
    if (!project_ID || !task_name || !assign_user_ID || !status) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
  
    // const db = new dbservice();
    const result = await db.insertProjectTask(project_ID, task_name, task_details, assign_user_ID, status);
    res.json({ success: result ? true : false });
  });
  
  
  
  
  
  app.get('/api/jobs/:jobID/applicant-count', async (req, res) => {
    try {
      const jobID = req.params.jobID;
      const count = await db.getApplicantCount(jobID);
      res.json(count);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  app.get('/api/jobs/:jobID/applicants', async (req, res) => {
    try {
      const jobID = req.params.jobID;
      const applicants = await db.getApplicantsByJob(jobID);
      res.json(applicants);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  app.get('/api/applications/:applicationID/download-cv', async (req, res) => {
    try {
      const applicationID = req.params.applicationID;
      const cvFile = await db.getCVByApplicationID(applicationID);
      if (!cvFile) {
        return res.status(404).send('CV not found');
      }
  
      res.setHeader('Content-Disposition', `attachment; filename=cv_${applicationID}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(cvFile);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  // Route: Update applicant status
app.post("/api/update-applicant-status", async (req, res) => {
    const { application_ID, status, last_updated } = req.body;
  
    if (!application_ID || !status) {
      return res.status(400).json({ error: "Missing application_ID or status." });
    }
  
    try {
      const db = dbService.getDbServiceInstance();
      const result = await db.updateApplicantStatus(application_ID, status, last_updated);
  
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Application ID not found." });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.delete("/api/delete-job/:jobID", async (req, res) => {
    const { jobID } = req.params;
  
    if (!jobID) {
      return res.status(400).json({ error: "Missing job ID" });
    }
  
    try {
      const db = dbService.getDbServiceInstance();
      const result = await db.deleteJobById(jobID);
  
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Job not found" });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  

  app.post('/applyJob', async (req, res) => {
    const { job_ID, user_ID } = req.body;
    // const user_ID = req.session.user_ID; // assuming session is set
    // const user_ID = localStorage.getItem('ownUserID');  
    const db = dbService.getDbServiceInstance();
  
    if (!user_ID || !job_ID) {
      return res.status(400).json({ error: 'Missing user_ID or job_ID' });
    }
  
    try {
      const result = await db.applyForJob(user_ID, job_ID);
      res.status(200).json({ message: 'Application submitted', data: result });
    } catch (err) {
      console.error('Job apply error:', err);
      res.status(500).json({ error: 'Failed to apply' });
    }
  });

  app.get('/api/my-applications', async (req, res) => {
    const userID = req.query.userID;
    if (!userID) return res.status(400).json({ error: 'userID required' });
  
    // const db = DbService.getDbServiceInstance(); 
  
    try {
      const results = await db.getUserApplications(userID); // ✅ now this works
      res.json(results);
    } catch (err) {
      console.error('DB error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/profile-pic', async (req, res) => {
    const userID = req.query.userID;
    // console.log("Fetching profile pic for userID:", userID);
  
    if (!userID) {
      return res.status(400).json({ error: 'Missing userID' });
    }
  
    try {
      const db = dbService.getDbServiceInstance(); // make sure this works
      const profilePic = await db.getUserProfilePic(userID);
  
    //   console.log("Profile pic from DB:", profilePic);
  
      if (!profilePic) {
        return res.status(404).json({ error: 'Profile picture not found' });
      }
  
      res.status(200).json({ profile_pic_url: profilePic });
    } catch (err) {
      console.error("Error in /api/user/profile-pic:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  
  
  

app.post('/add_new_job', async (req, res) => {
    const { user_ID, job_title ,company_name ,location ,job_description ,requirement ,salary_min ,salary_max ,apply_process, selectedJobLevel, job_resposibility, benefits, about_company } = req.body;
  
    if (!user_ID || !job_title || !company_name || !location || !job_description || !requirement || !salary_min || !salary_max || !apply_process || !selectedJobLevel || !job_resposibility || !benefits || !about_company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      await db.add_new_job(user_ID, job_title ,company_name ,location ,job_description ,requirement ,salary_min ,salary_max ,apply_process, selectedJobLevel, job_resposibility, benefits, about_company);
      res.status(200).json({ message: 'Profile saved successfully' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

app.post('/projectCreationForm', async (req, res) => {
    const { user_ID, project_name ,project_details } = req.body;
  
    if (!user_ID || !project_name  || !project_details) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      await db.projectCreationForm(user_ID, project_name, project_details );
      res.status(200).json({ message: 'Profile saved successfully' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/dashboard/projects', async (req, res) => {
    const userID = req.query.userID;
  
    if (!userID) return res.status(400).json({ error: 'userID is required' });
  
    try {
      const projects = await db.getProjectsByUser(userID);
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Delete project
app.delete('/api/dashboard/projects/:id', async (req, res) => {
    const projectID = req.params.id;
    try {
      await db.deleteProject(projectID);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });
  

  // GET job details
app.get('/get-job-details', async (req, res) => {
    const jobId = req.query.job_id;
  
    if (!jobId) {
      return res.status(400).json({ error: 'Missing job_id parameter' });
    }
  
    try {
      const job = await db.getJobDetails(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
// app.get('/getJobs', async (req, res) => {
//     const { page = 1, location, experience, salary } = req.query;
//     const limit = 6;
//     const offset = (page - 1) * limit;
  
//     try {
//       const jobs = await db.getJobPosts({ location, experience, salary, limit, offset });
//       res.json(jobs);
//     } catch (err) {
//       console.error('Error fetching jobs:', err);
//       res.status(500).json({ error: 'Failed to fetch jobs' });
//     }
//   });
// app.get('/getJobs', async (req, res) => {
//     const { page = 1, location, experience, salary, search } = req.query;
//     const limit = 6;
//     const offset = (page - 1) * limit;
  
//     try {
//       const jobs = await db.getJobPosts({ location, experience, salary, search, limit, offset });
//       res.json(jobs);
//     } catch (err) {
//       console.error('Error fetching jobs:', err);
//       res.status(500).json({ error: 'Failed to fetch jobs' });
//     }
//   });
app.get('/getJobs', async (req, res) => {
    const { page = 1, location, experience, salary, search } = req.query;
    const limit = 6;
    const offset = (page - 1) * limit;
  
    try {
      const [jobs, totalCount] = await Promise.all([
        db.getJobPosts({ location, experience, salary, search, limit, offset }),
        db.getJobCount({ location, experience, salary, search })
      ]);
  
      res.json({ jobs, totalCount });
    } catch (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });
  






//
//Rifat update.....//
//

app.post('/filterPosts', async (req, res) => {
    const { categories } = req.body;
    console.log("app " + categories);
    const db = dbService.getDbServiceInstance();

    try {
        if (!categories || categories.length === 0) {
            return res.status(400).json({ error: 'No categories selected' });
        }

        const data = await db.getFilteredPosts(categories);

        if (data.length === 0) {
            return res.json({ data: [] });  // Return empty array if no posts found
        }

        res.json({ data: data });
    } catch (error) {
        console.error('Error filtering posts:', error);
        res.status(500).json({ error: 'Failed to filter posts' });
    }
});

// insert work data
app.post('/insertWorkInfo', (request, response) => {
    const userID = request.body.userID;
    const company_name = request.body.company_name;
    const position = request.body.position;
    const start_date = request.body.start_date;
    const end_date = request.body.end_date;
    const db = dbService.getDbServiceInstance();

    const result = db.insertWorkData(userID, company_name, position, start_date, end_date);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// insert Education data
app.post('/insertEduInfo', (request, response) => {
    const userID = request.body.userID;
    const field = request.body.field;
    const college = request.body.college;
    const start_date = request.body.start_date;
    const end_date = request.body.end_date;
    const db = dbService.getDbServiceInstance();

    const result = db.insertEduData(userID, field, college, start_date, end_date);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// insert Address data
app.post('/insertAddressInfo', (request, response) => {
    const userID = request.body.userID;
    const address = request.body.address;
    const start_date = request.body.start_date;
    const end_date = request.body.end_date;
    const db = dbService.getDbServiceInstance();

    const result = db.insertAddressData(userID, address, start_date, end_date);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// insert Link data
app.post('/insertLink', (request, response) => {
    const userID = request.body.userID;
    const link = request.body.link;
    const site_name = request.body.site_name;
    const db = dbService.getDbServiceInstance();

    const result = db.insertLink(userID, link, site_name);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read all work data
app.get('/getAllWorkData/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllWorkData(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read all edu data
app.get('/getAllEduData/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllEduData(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read all Address data
app.get('/getAllAddressData/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllAddressData(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read all Links data
app.get('/getAllLinksData/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllLinksData(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// read profile name 
app.get('/getCurrentUserName/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getCurrentUserName(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// delete work info
app.delete('/deleteWorkInfo/:Role_ID', (request, response) => {
    const Role_ID = request.params.Role_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteWorkInfo(Role_ID);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// delete Edu info
app.delete('/deleteEduInfo/:id', (request, response) => {
    const id = request.params.id;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteEduInfo(id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// delete address info
app.delete('/deleteAddressInfo/:id', (request, response) => {
    const id = request.params.id;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteAddressInfo(id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// delete link info
app.delete('/deleteLinkInfo/:id', (request, response) => {
    const id = request.params.id;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteLinkInfo(id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// update profile pic
app.patch('/updateProfilePic', (request, response) => {
    const userID = request.body.userID;
    const url = request.body.imageURL;
    const db = dbService.getDbServiceInstance();

    const result = db.updateProfilePic(userID, url);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// update cover pic
app.patch('/updateCoverPic', (request, response) => {
    const userID = request.body.userID;
    const url = request.body.imageURL;
    const db = dbService.getDbServiceInstance();

    const result = db.updateCoverPic(userID, url);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// update name and bio
app.patch('/updateNameBio', (request, response) => {
    const userID = request.body.userID;
    const name = request.body.name;
    const bio = request.body.bio;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameBio(userID, name, bio);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// update work info
app.patch('/updateWorkInfo', (request, response) => {
    const id = request.body.id;
    const company = request.body.company;
    const field = request.body.field;
    const start_date = request.body.start_date;
    const end_date = request.body.end_date;

    const db = dbService.getDbServiceInstance();

    const result = db.updateWorkInfo(id, company, field, start_date, end_date);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// update Edu info
app.patch('/updateEduInfo', (request, response) => {
    const id = request.body.id;
    const college = request.body.college;
    const field = request.body.field;
    const start_date = request.body.start_date;
    const end_date = request.body.end_date;

    const db = dbService.getDbServiceInstance();

    const result = db.updateEduInfo(id, college, field, start_date, end_date);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// searching profile
app.get('/searchingProfile/:ownUserID/:text', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const text = request.params.text;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingProfile(ownUserID, text);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})



// ###########################################           By Rifat           ############################

//create

app.post('/registration', async (request, response) => {
    // console.log(request.body);
    const { fullName, userName, email, dateOfBirth, gender, pass1 } = request.body;
    // console.log(name);
    // console.log(pass);
    const db = dbService.getDbServiceInstance();

    const result = await db.registration(fullName, userName, email, dateOfBirth, gender, pass1);

    if (result.success) {
        response.status(201).json({ ID: result.ID, message: 'Post created successfully' });
    } else {
        response.status(500).json({ error: result.message });
    }
    // result
    // .then(data => response.json({success: true}))
    // .catch(err =>console.log(err));
})

app.post('/insertRegistrationProfilePic', async (request, response) => {
    // console.log(request.body);
    const { userID: userID, imageURL: imageUrl } = request.body;
    // console.log(pass);
    const db = dbService.getDbServiceInstance();

    const result = await db.insertRegistrationProfilePic(userID, imageUrl);

    if (result.success) {
        response.status(201).json({ ID: result.ID, message: 'Post created successfully' });
    } else {
        response.status(500).json({ error: result.message });
    }

})
app.post('/insertRegistrationCoverPic', async (request, response) => {
    // console.log(request.body);
    const { userID: userID, imageURL: imageUrl } = request.body;
    // console.log(name);
    // console.log(pass);
    const db = dbService.getDbServiceInstance();

    const result = await db.insertRegistrationCoverPic(userID, imageUrl);

    if (result.success) {
        response.status(201).json({ ID: result.ID, message: 'Post created successfully' });
    } else {
        response.status(500).json({ error: result.message });
    }

})
// app.post('/addPost/:userName',async(request,response)=>{
//     // console.log(request.body);
//     const userName = request.params.userName;
//     const {Caption,content,Category_Name, Privacy} = request.body;
//     // console.log(name);
//     // console.log(pass);
//     const db = dbService.getDbServiceInstance();

//     const result = await db.addPost(Caption,content,Category_Name, Privacy,userName);

//     response.json({ data: result });
// })

app.post('/addPost/:userName', async (req, res) => {
    const userName = req.params.userName;
    const { Caption, content, Category_Name, Privacy } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const result = await db.addPost(Caption, content, Category_Name, Privacy, userName);

        if (result.success) {
            res.status(201).json({ postID: result.postID, message: 'Post created successfully' });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
});


app.get('/getUserName/:user_ID', (requist, response) => {
    const user_ID = requist.params.user_ID;
    // console.log(user_ID);
    const db = dbService.getDbServiceInstance();

    const result = db.getUserName(user_ID);


    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})




app.get('/getAll', (requist, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getALLData();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})
app.get('/getAllPost', (requist, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllPost();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})
app.get('/getPostFile/:post_ID', (request, response) => {
    const post_ID = request.params.post_ID;
    const db = dbService.getDbServiceInstance();
    // console.log("app -"+post_ID);
    const result = db.getPostFile(post_ID);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})
// app.get('/getPostFile/:post_ID', async (request, response) => {
//     const post_ID = request.params.post_ID; // Correctly access post_ID from request.params
//     console.log("app - " + post_ID); // Log to see if post_ID is correct

//     const db = dbService.getDbServiceInstance();

//     try {
//         const result = await db.getPostFile(post_ID); // Fetch data using post_ID
//         response.json({ data: result });
//     } catch (err) {
//         console.error(err);
//         response.status(500).json({ error: 'An error occurred while fetching post file.' });
//     }
// });

app.patch('/updatePostLike/:userName', (request, response) => {
    const userName = request.params.userName;
    const post_ID = request.body.post_ID;

    const db = dbService.getDbServiceInstance();

    const result = db.updatePostLike(userName, post_ID);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})
app.patch('/updatePostDisLike/:userName', (request, response) => {
    const userName = request.params.userName;
    const post_ID = request.body.post_ID;

    const db = dbService.getDbServiceInstance();

    const result = db.updatePostDisLike(userName, post_ID);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

app.post('/insertPostFile', (request, response) => {
    const postID = request.body.postID;
    const imageURL = request.body.imageURL;
    const db = dbService.getDbServiceInstance();

    const result = db.insertPostFile(postID, imageURL);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Getting current user info
app.get('/gettingCurrentUserInfo/:username', (request, response) => {
    const username = request.params.username;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingCurrentUserInfo(username);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// Getting current user's friend info
app.get('/gettingFriendsInfo/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingFriendsInfo(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// Getting current user's Followers info
app.get('/gettingFollowersInfo/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingFollowersInfo(userID, 'Followers');
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// Getting current user's following info
app.get('/gettingFollowingsInfo/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingFollowersInfo(userID, 'Followings');
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.get('/searchingFriendStatus/:ownUserID/:otherUserID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const otherUserID = request.params.otherUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingFriendStatus(ownUserID, otherUserID, 0);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/searchingFriendStatus1/:ownUserID/:otherUserID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const otherUserID = request.params.otherUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingFriendStatus(ownUserID, otherUserID, 1);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

app.get('/searchingFriendStatus2/:ownUserID/:otherUserID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const otherUserID = request.params.otherUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingFriendStatus(ownUserID, otherUserID, 2);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// inserting friend req
app.post('/insertingFriendReq', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const otherUserID = request.body.otherUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.insertingFriendReq(ownUserID, otherUserID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// cancelling friend req
app.delete('/cancelFriendReq/:ownUserID/:otherUserID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const otherUserID = request.params.otherUserID;
    const db = dbService.getDbServiceInstance();

    // Call the database function to delete the friend request
    const result = db.cancelFriendReq(ownUserID, otherUserID);

    result
        .then(data => {
            if (data) {
                response.json({ success: true });
            } else {
                response.json({ success: false });
            }
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Server error' });
        });
});

// Accepting friend req
app.patch('/AcceptFriendReq', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const otherUserID = request.body.otherUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.AcceptFriendReq(ownUserID, otherUserID);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// searching location permission
app.get('/locationPermission/:ownUserID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.locationPermission(ownUserID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// update location permission 
app.patch('/updateLocationPermission', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const x = request.body.x;
    const db = dbService.getDbServiceInstance();

    const result = db.updateLocationPermission(ownUserID, x);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})


// insert location info
app.patch('/insertLocationInfo', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const latitude = request.body.latitude;
    const longitude = request.body.longitude;
    const DateTime = request.body.DateTime;
    const db = dbService.getDbServiceInstance();

    const result = db.insertLocationInfo(ownUserID, latitude, longitude, DateTime);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});


// sending location permission
app.patch('/sendingLocationPermission', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const otherUserID = request.body.otherUserID;
    const x = request.body.x;
    const db = dbService.getDbServiceInstance();

    const result = db.sendingLocationPermission(ownUserID, otherUserID, x);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})

// searching location
app.get('/gettingSpecificLocation/:id', (request, response) => {
    const id = request.params.id;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingSpecificLocation(id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.get('/gettingNameofSender/:id', (request, response) => {
    const id = request.params.id;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingNameofSender(id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.post('/insertNotification', (request, response) => {
    const notification_text = request.body.notification_text;
    const id = request.body.id;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNotification(notification_text, id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// search notification
app.get('/searchingNotification/:ownUserID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingNotification(ownUserID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// Getting current user's friend req info
app.get('/gettingFriendReqInfo/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.gettingFriendReqInfo(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// Getting mutual friend
app.get('/gettingMutualFriend/:ownUserID_1/:otherUserID', (request, response) => {
    const ownUserID = request.params.ownUserID_1;
    const otherUserID = request.params.otherUserID;

    const db = dbService.getDbServiceInstance();

    const result = db.gettingMutualFriend(ownUserID, otherUserID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// insert user report
app.post('/insertUserReport', (request, response) => {
    const id = request.body.id;
    const problemType = request.body.problemType;
    const problemDescription = request.body.problemDescription;
    const db = dbService.getDbServiceInstance();

    const result = db.insertUserReport(id, problemType, problemDescription);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});


///
// Rifat
///
app.get('/getAllFriendListForMessenger/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    // console.log(user_ID);

    const db = dbService.getDbServiceInstance();
    const result = db.getAllFriendListForMessenger(user_ID);  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});

app.get('/getAllMessengerForTarget/:MyID/:targetFriend_ID', async (req, res) => {
    const { MyID, targetFriend_ID } = req.params;
    // console.log("app.js: "+MyID+" "+targetFriend_ID);

    const db = dbService.getDbServiceInstance();
    try {
        // Make sure to await the Promise returned by getMessagesBetweenFriends
        const messages = await db.getMessagesBetweenFriends(MyID, targetFriend_ID);
        // console.log("app.js: ", messages);  // This will now correctly log the fetched messages
        res.json(messages);                 // Send the messages to the Frontend
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.post('/messagersTextStoreToDatabase/:MyID/:targetFriend_ID', async (req, res) => {
    const { MyID, targetFriend_ID } = req.params;
    const { messageText } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const result = await db.messagersTextStoreToDatabase(MyID, targetFriend_ID, messageText);

        if (result.success) {
            res.status(201).json({ postID: result.postID, message: 'Post created successfully' });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
});

//
app.get('/userStatistics', (request, response) => {
    // const user_ID = request.params.user_ID;
    // console.log(user_ID);

    const db = dbService.getDbServiceInstance();
    const result = db.userStatistics();  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});

app.delete('/deleteUserByAdmin/:user_ID', (request, response) => {
    const { user_ID } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteUserByAdmin(user_ID);  // Assuming this method is implemented in dbservice.js

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false, error: "Failed to delete alarm" });
        });
});

app.get('/getAllPostForAdmin', (requist, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllPostForAdmin();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

});
app.get('/getAllProblemOfUser', (requist, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllProblemOfUser();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

});
app.get('/getAllPostReport', (requist, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllPostReport();

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

});
app.delete('/deletePostByAdmin/:post_ID', (request, response) => {
    const { post_ID } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deletePostByAdmin(post_ID);  // Assuming this method is implemented in dbservice.js

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false, error: "Failed to delete alarm" });
        });
});
app.delete('/deleteProblemByAdmin/:report_ID', (request, response) => {
    const { report_ID } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteProblemByAdmin(report_ID);  // Assuming this method is implemented in dbservice.js

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false, error: "Failed to delete alarm" });
        });
});
//

app.get('/getAllActivity/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    // console.log(user_ID);

    const db = dbService.getDbServiceInstance();
    const result = db.getAllActivity(user_ID);  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});
//

app.get('/getAllAlarmList/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    // console.log(user_ID);

    const db = dbService.getDbServiceInstance();
    const result = db.getAllAlarmList(user_ID);  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});
app.delete('/deleteExpiredAlarm/:P_Notified_ID', (request, response) => {
    const { P_Notified_ID } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteExpiredAlarm(P_Notified_ID);  // Assuming this method is implemented in dbservice.js

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false, error: "Failed to delete alarm" });
        });
});
app.patch('/deletAlarm', (request, response) => {
    // const userName = request.params.userName;
    const alarm_ID = request.body.alarm_ID;
    // console.log("app.js ");
    const db = dbService.getDbServiceInstance();

    const result = db.deletAlarm(alarm_ID);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
})
app.post('/setAlarm', async (req, res) => {
    const { date, time, levelOfAlarm, message, user_ID } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const result = await db.setAlarm(date, time, levelOfAlarm, message, user_ID);
        if (result.success) {
            res.status(201).json({ success: true, message: 'Alarm set successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to set alarm' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in server' });
    }
});

app.post('/incrementActivity', async (req, res) => {
    const { user_ID, post_ID, column } = req.body;
    const db = dbService.getDbServiceInstance();
    if (!user_ID || !post_ID || !column) {
        return res.status(400).json({ message: 'Missing parameters: userID, postID, or column.' });
    }

    try {
        const result = db.incrementActivityIfNotExists(column, user_ID, post_ID);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Activity incremented successfully.' });
        } else {
            res.status(200).json({ message: 'Post_ID and User_ID already exist, no update performed.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error incrementing activity.', error: error.message });
    }
});


app.post('/insertUserPostActivity', async (req, res) => {
    const { user_ID, post_ID } = req.body;
    const db = dbService.getDbServiceInstance();
    try {
        db.insertUserPostActivity(user_ID, post_ID);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error in insertUserPostActivity:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/getAlarmDataForFeed/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    // console.log(user_ID);

    const db = dbService.getDbServiceInstance();
    const result = db.getAlarmDataForFeed(user_ID);  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});

// by Asif//

// searching existing rerport created by same account
app.get('/searchingReport/:ownUserID/:post_ID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const post_ID = request.params.post_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingReport(ownUserID, post_ID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// creating new report
app.post('/insertNewReport', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const post_ID = request.body.post_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewReport(ownUserID, post_ID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// get all post related to user
app.get('/getAllPostPerOwner/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllPostPerOwner(userID);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})
app.get('/getAllPostPerUser/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllPostPerUser(userID);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})

// delete post
app.delete('/DeletePost/:ownUserID/:post_id', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const post_id = request.params.post_id;
    const db = dbService.getDbServiceInstance();

    const result = db.DeletePost(ownUserID, post_id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// searching existing saved by same account
app.get('/searchingSave/:ownUserID/:post_ID', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const post_ID = request.params.post_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingSave(ownUserID, post_ID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// insert save post
app.post('/insertSavePost', (request, response) => {
    const ownUserID = request.body.ownUserID;
    const post_id = request.body.post_id;
    const db = dbService.getDbServiceInstance();

    const result = db.insertSavePost(ownUserID, post_id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// delete saved post
app.delete('/deleteSavedPost/:ownUserID/:post_id', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const post_id = request.params.post_id;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteSavedPost(ownUserID, post_id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// get all saved post
app.get('/getAllSavedPost/:userID', (request, response) => {
    const userID = request.params.userID;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllSavedPost(userID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// searching friend
app.get('/searchingFriend/:ownUserID/:text', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const text = request.params.text;
    const db = dbService.getDbServiceInstance();

    const result = db.searchingFriend(ownUserID, text);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})


// Add marketplace
app.post('/addProductToMarketplace/:user_ID', async (req, res) => {
    const user_ID = req.params.user_ID;
    const { itemTitle, itemDescription, category, price, contactNumber, contactEmail, location } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const result = await db.addProductToMarketplace(itemTitle, itemDescription, category, price, contactNumber, contactEmail, location, user_ID);

        if (result.success) {
            res.status(201).json({ item_ID: result.postID, message: 'Post created successfully' });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
});

app.post('/insertProductFile', (request, response) => {
    const postID = request.body.postID;
    const imageURL = request.body.imageURL;
    const db = dbService.getDbServiceInstance();

    const result = db.insertProductFile(postID, imageURL);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});



app.get('/getItemFile/:post_ID', (request, response) => {
    const post_ID = request.params.post_ID;
    const db = dbService.getDbServiceInstance();
    // console.log("app -"+post_ID);
    const result = db.getItemFile(post_ID);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
    // response.json({
    //     success: true
    // });

})

app.get('/getAllProductperUser/:id', (request, response) => {
    const id = request.params.id;
    const db = dbService.getDbServiceInstance();

    const result = db.getAllProductperUser(id);

    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

// Search products by text and optional category
app.get('/searching_product', (request, response) => {
    const text = request.query.text || '';
    const category = request.query.category || ''; // e.g., 'vehicles', 'electronics', etc.


    const db = dbService.getDbServiceInstance();

    const result = db.searching_product(text, category);
    result
        .then(data => response.json({ items: data })) // 👈 change `data` to `items`
        .catch(err => console.log(err));

});


app.get('/getPostComment/:post_ID', (requist, response) => {
    const post_ID = requist.params.post_ID;
    // console.log(user_ID);
    const db = dbService.getDbServiceInstance();

    const result = db.getPostComment(post_ID);


    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));


})

app.post('/storePostCommentByViewrs', async (req, res) => {
    const { user_ID, post_ID, commentText } = req.body;
    // console.log(user_ID,post_ID,commentText);
    const db = dbService.getDbServiceInstance();
    if (!user_ID || !post_ID || !commentText) {
        return res.status(400).json({ message: 'Missing parameters: userID, postID, or column.' });
    }

    try {
        const result = db.storePostCommentByViewrs(user_ID, post_ID, commentText);

    } catch (error) {
        res.status(500).json({ message: 'Error incrementing activity.', error: error.message });
    }
});

app.get('/getAllActivity/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    // console.log(user_ID);

    const db = dbService.getDbServiceInstance();
    const result = db.getAllActivity(user_ID);  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});

// delete post
app.delete('/DeleteItem/:ownUserID/:post_id', (request, response) => {
    const ownUserID = request.params.ownUserID;
    const post_id = request.params.post_id;
    const db = dbService.getDbServiceInstance();

    const result = db.DeleteItem(ownUserID, post_id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});


// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

// ⚠️ This is critical: catch `/category/:slug` and serve `category.html`
app.get('/Marketplace/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Marketplace/index.html'));
});

app.get('/getUserProduct/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.getUserProduct(user_ID);

    result
        .then(data => response.json({ items: data }))
        .catch(err => console.log(err));
})

app.get('/api/:slug', (req, res) => {
    const { slug } = req.params;
    const db = dbService.getDbServiceInstance();

    // 'All' category: return all products
    if (slug.toLowerCase() === 'all') {
        db.getAllProduct()
            .then(data => res.json({ items: data }))
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Failed to fetch products' });
            });
    } else {
        db.getProductByCategory(slug)
            .then(data => res.json({ items: data }))
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Failed to fetch products' });
            });
    }
});


app.get('/getProductByItemID/:item_ID', (request, response) => {
    const item_ID = request.params.item_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.getProductByItemID(item_ID);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.get('/getUserInfoByUserID/:seller_id', (request, response) => {
    const seller_id = request.params.seller_id;
    const db = dbService.getDbServiceInstance();

    const result = db.getUserInfoByUserID(seller_id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
})

app.post("/updateItem", (req, res) => {
    const db = dbService.getDbServiceInstance();
    const { item_ID, Title, Description, location, Price, Seller_Number, Seller_Email } = req.body;

    db.updateItem({ item_ID, Title, Description, location, Price, Seller_Number, Seller_Email })
        .then(result => res.json({ success: true }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false });
        });
});

app.delete('/deleteMarketplaceItem/:item_ID', (request, response) => {
    const item_ID = request.params.item_ID;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteMarketplaceItem(item_ID);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// Get all messages between two users
app.get('/getMessages/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;

    const db = dbService.getDbServiceInstance();
    db.getMessagesBetweenUsers(user1, user2)
        .then(messages => {
            res.json({ messages });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch messages' });
        });
});

app.post('/sendMessage', (req, res) => {
    const { senderID, receiverID, message_content } = req.body;

    const db = dbService.getDbServiceInstance();
    db.sendMessage(senderID, receiverID, message_content)
        .then(success => {
            res.json({ success });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, error: 'Message sending failed' });
        });
});

app.post('/getConversationUsers', async (req, res) => {
    const { userID } = req.body;
    const db = dbService.getDbServiceInstance();

    if (!userID) {
        return res.status(400).json({ error: 'userID is required' });
    }

    try {
        const users = await db.getConversationUsers(userID);
        res.json(users);
    } catch (error) {
        console.error('Error fetching conversation users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(process.env.PORT, () =>
    console.log(`App is running on http://localhost:${process.env.PORT}`)
);