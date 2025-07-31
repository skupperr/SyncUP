const mysql = require('mysql');
const dotenv = require('dotenv');
const { response } = require('express');
const { NULL } = require('mysql/lib/protocol/constants/types');
dotenv.config();
let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
})

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
})


class dbService {
    static getDbServiceInstance() {
        return instance ? instance : new dbService();
    }

    // static getDbServiceInstance() {
    //     return instance ? instance : new dbService();
    //   }




    async getJobsByUser(userID) {
        return new Promise((resolve, reject) => {
          const sql = `
            SELECT job_ID, job_title, DATEDIFF(CURDATE(), created_at) AS posted_days_ago
            FROM all_job_list
            WHERE user_ID = ?
          `;
          connection.query(sql, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      }
    
        // Search for friends based on user ID and query
        async searchFriends(user_ID, query) {
          user_ID = parseInt(user_ID, 10);
          if (isNaN(user_ID)) {
            console.error("Invalid user_ID:", user_ID);
            return [];
          }
        
          const searchQuery = `%${query}%`;
        
          try {
            const response = await new Promise((resolve, reject) => {
              const sql = `
              SELECT 
              u.user_ID AS id, 
              u.fullName AS name, 
              u.email, 
              u.profile_pic
            FROM friends f
            JOIN user u 
              ON u.user_ID = IF(f.user_ID = ?, f.Friend_ID, f.user_ID)
            WHERE f.status = 'YES'
              AND (? IN (f.user_ID, f.Friend_ID))
              AND (u.fullName LIKE ? OR u.email LIKE ?)
              `;
        
              connection.query(sql, [user_ID, user_ID, searchQuery, searchQuery], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
              });
            });
        
            return response;
          } catch (error) {
            console.log(error);
          }
        }
    
    
        async getProjectTeamMembers(projectID) {
          projectID = parseInt(projectID, 10);
          try {
            const response = await new Promise((resolve, reject) => {
              const sql = `
                SELECT u.user_ID, u.fullName, u.email, u.profile_pic
                FROM project_team pt
                JOIN user u ON pt.user_ID = u.user_ID
                WHERE pt.project_ID = ?
              `;
              connection.query(sql, [projectID], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
              });
            });
        
            return response;
          } catch (error) {
            console.log(error);
          }
        }
    
        async insertProjectTask(project_ID, task_name, task_details, assign_user_ID, status) {
          try {
            const response = await new Promise((resolve, reject) => {
              const sql = `
                INSERT INTO project_task (project_ID, task_name, task_details, assign_user_ID, status)
                VALUES (?, ?, ?, ?, ?)
              `;
              connection.query(sql, [project_ID, task_name, task_details, assign_user_ID, status], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
              });
            });
        
            return response;
          } catch (error) {
            console.log(error);
          }
        }
    
        async getTasksByProjectID(projectID) {
          return await new Promise((resolve, reject) => {
            const query = `
            SELECT pt.task_ID, pt.task_name, pt.status, pt.task_details, u.fullName AS assignee_name, u.user_ID
            FROM project_task pt
            JOIN user u ON pt.assign_user_ID = u.user_ID
            WHERE pt.project_ID = ?`;
        
            connection.query(query, [projectID], (err, results) => {
              if (err) reject(err);
              resolve(results);
            });
          });
        }
    
        async updateTask(taskID, status, assign_user_ID) {
          return await new Promise((resolve, reject) => {
            const query = `UPDATE project_task SET status = ?, assign_user_ID = ? WHERE task_ID = ?`;
            connection.query(query, [status, assign_user_ID, taskID], (err, result) => {
              if (err) reject(err);
              resolve(result.affectedRows > 0);
            });
          });
        }
    
        async deleteTask(taskID) {
          return await new Promise((resolve, reject) => {
            const query = `DELETE FROM project_task WHERE task_ID = ?`;
            connection.query(query, [taskID], (err, result) => {
              if (err) reject(err);
              resolve(result.affectedRows > 0);
            });
          });
        }
    
        // Project info
    async getProjectDetails(projectID) {
      return await new Promise((resolve, reject) => {
        const sql = "SELECT project_name, project_details, created_date FROM projects WHERE project_ID = ?";
        connection.query(sql, [projectID], (err, result) => {
          if (err) reject(err);
          else resolve(result[0]);
        });
      });
    }
    
    // Task counts by status
    async getTaskStatusCounts(projectID) {
      return await new Promise((resolve, reject) => {
        const sql = `
          SELECT status, COUNT(*) as count
          FROM project_task
          WHERE project_ID = ?
          GROUP BY status
        `;
        connection.query(sql, [projectID], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    
        
        
        
        
        
    
        
    
      // Add member to a project team
      async addMemberToProject(projectID, memberID) {
        projectID = parseInt(projectID, 10);
        memberID = parseInt(memberID, 10);
    
    
        try {
          const response = await new Promise((resolve, reject) => {
            const sql = `
              INSERT IGNORE INTO project_team (user_ID, project_ID)
              VALUES (?, ?)
            `;
    
            connection.query(sql, [memberID, projectID], (err, results) => {
              if (err) reject(new Error(err.message));
              else resolve(results);
            });
          });
    
          return response;
        } catch (error) {
          console.log(error);
        }
      }
    
      async getApplicantCount(jobID) {
        const sql = `SELECT COUNT(*) as count FROM job_applications WHERE job_ID = ?`;
        return new Promise((resolve, reject) => {
          connection.query(sql, [jobID], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          });
        });
      }
    
      async getApplicantsByJob(jobID) {
        const sql = `
        SELECT 
        ja.application_ID, 
        ja.job_ID, 
        ja.user_ID, 
        ja.applied_at,
        ja.applicant_status,
        u.full_name, 
        usr.Profile_Pic
      FROM job_applications ja
      JOIN user_profile u ON ja.user_ID = u.user_ID
      JOIN user usr ON ja.user_ID = usr.user_ID
      WHERE ja.job_ID = ?;
        `;
        return new Promise((resolve, reject) => {
          connection.query(sql, [jobID], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      }
    
      async getCVByApplicationID(applicationID) {
        const sql = `SELECT cv_file FROM job_applications WHERE application_ID = ?`;
        return new Promise((resolve, reject) => {
          connection.query(sql, [applicationID], (err, results) => {
            if (err) return reject(err);
            resolve(results.length ? results[0].cv_file : null);
          });
        });
      }
    
      async updateApplicantStatus(application_ID, status, last_updated) {
        return new Promise((resolve, reject) => {
          const query = `
            UPDATE job_applications 
            SET applicant_status = ?,
            last_updated = ? 
            WHERE application_ID = ?
          `;
    
          connection.query(
            query,
            [status, last_updated, application_ID],
            (err, results) => {
              if (err) {
                reject(err);
              }
              resolve(results);
            }
          );
        });
      }
      async deleteJobById(jobID) {
        return new Promise((resolve, reject) => {
          const deleteApplicationsQuery =
            "DELETE FROM job_applications WHERE job_ID = ?";
          const deleteJobQuery = "DELETE FROM all_job_list WHERE job_ID = ?";
    
          connection.beginTransaction((err) => {
            if (err) return reject(err);
    
            connection.query(deleteApplicationsQuery, [jobID], (err, result) => {
              if (err) {
                return connection.rollback(() => reject(err));
              }
    
              connection.query(deleteJobQuery, [jobID], (err, result) => {
                if (err) {
                  return connection.rollback(() => reject(err));
                }
    
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => reject(err));
                  }
                  resolve(result);
                });
              });
            });
          });
        });
      }
    
    //   async getUserApplications(userID) {
    //     console.log("bd " + userID);
    //     return new Promise((resolve, reject) => {
    //       const query = `
    //         SELECT aj.job_ID, aj.applicant_status, aj.applied_at, aj.last_updated,
    //                j.company_name, j.job_title
    //         FROM job_applications aj
    //         JOIN all_job_list j ON aj.job_ID = j.job_ID
    //         WHERE aj.user_ID = ?
    //         ORDER BY aj.applied_at ASC;
    //       `;
    
    //       this.connection.query(query, [userID], (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //       });
    //     });
    //   }
    
      async getUserApplications(userID) {
        // console.log("bd " + userID);
        return new Promise((resolve, reject) => {
            const query = `
            SELECT aj.job_ID, aj.applicant_status, aj.applied_at, aj.last_updated,
                   j.company_name, j.job_title
            FROM job_applications aj
            JOIN all_job_list j ON aj.job_ID = j.job_ID
            WHERE aj.user_ID = ?
            ORDER BY aj.applied_at ASC;
          `;
    
          connection.query(query, [userID], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      }
    
      async getUserProfilePic(userID) {
        return new Promise((resolve, reject) => {
          const query = "SELECT profile_pic FROM user WHERE user_ID = ?";
            connection.query(query, [userID], (err, results) => {
            if (err) {
              console.error("DB Error:", err);
              return reject(err);
            }
      
            if (results.length === 0) {
              console.warn("No user found for ID:", userID);
              return resolve(null);
            }
      
            resolve(results[0].profile_pic);
          });
        });
      }
      
      
      
    
      
    
      //   async deleteJobById(jobID) {
      //     return new Promise((resolve, reject) => {
      //       const query = "DELETE FROM all_job_list WHERE job_ID = ?";
    
      //       connection.query(query, [jobID], (err, result) => {
      //         if (err) {
      //           reject(err);
      //         }
      //         resolve(result);
      //       });
      //     });
      //   }
    
      //   async saveUserProfile(user_ID, fullName, email, phone) {
      //     try {
      //       const response = await new Promise((resolve, reject) => {
      //         const query = `INSERT INTO user_profile (user_ID, full_name, email, phone)
      //                            VALUES (?, ?, ?, ?)
      //                            ON DUPLICATE KEY UPDATE full_name = ?, email = ?, phone = ?`;
    
      //         connection.query(
      //           query,
      //           [user_ID, fullName, email, phone, fullName, email, phone],
      //           (err, result) => {
      //             if (err) reject(new Error(err.message));
      //             resolve(result);
      //           }
      //         );
      //       });
    
      //       return { id: response };
      //     } catch (error) {
      //       console.error("Database error:", error);
      //       throw error;
      //     }
      //   }
    
      async applyForJob(user_ID, job_ID) {
        try {
          const response = await new Promise((resolve, reject) => {
            // Get CV file first
            const getCVQuery = `SELECT cv_file FROM user_profile WHERE user_ID = ?`;
            connection.query(getCVQuery, [user_ID], (err, result) => {
              if (err) return reject(err);
              if (result.length === 0) return reject(new Error("No CV found"));
    
              const cv_file = result[0].cv_file;
    
              const insertQuery = `
                INSERT INTO job_applications (job_ID, user_ID, cv_file, applicant_status)
                VALUES (?, ?, ?, "pending")
              `;
              connection.query(
                insertQuery,
                [job_ID, user_ID, cv_file],
                (err, res2) => {
                  if (err) return reject(err);
                  resolve(res2);
                }
              );
            });
          });
    
          return response;
        } catch (error) {
          console.error("Database applyForJob error:", error);
          throw error;
        }
      }
    
      async saveUserProfile(user_ID, full_name, email, phone, cvBuffer) {
        return new Promise((resolve, reject) => {
          const sql = `
                INSERT INTO user_profile (user_ID, full_name, email, phone, cv_file)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                  full_name = VALUES(full_name),
                  email = VALUES(email),
                  phone = VALUES(phone),
                  cv_file = VALUES(cv_file)
              `;
          const params = [user_ID, full_name, email, phone, cvBuffer];
    
          connection.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      }
    
      async add_new_job(
        user_ID,
        job_title,
        company_name,
        location,
        job_description,
        requirement,
        salary_min,
        salary_max,
        apply_process,
        selectedJobLevel,
        job_resposibility,
        benefits,
        about_company
      ) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = `INSERT INTO all_job_list (user_ID, job_title, company_name, location, job_description, job_requirement, salary_min, salary_max, application_process, job_level, job_resposibility, job_benefits, about_company)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            connection.query(
              query,
              [
                user_ID,
                job_title,
                company_name,
                location,
                job_description,
                requirement,
                salary_min,
                salary_max,
                apply_process,
                selectedJobLevel,
                job_resposibility,
                benefits,
                about_company,
              ],
              (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
              }
            );
          });
    
          return { id: response };
        } catch (error) {
          console.error("Database error:", error);
          throw error;
        }
      }
    
    
      async projectCreationForm(
        user_ID,
        project_name,
        project_details,
      ) {
        try {
          const response = await new Promise((resolve, reject) => {
            const query = `INSERT INTO projects (project_name, project_details,	user_ID)
                               VALUES (?, ?, ?)`;
    
            connection.query(
              query,
              [
                project_name,
                project_details,
                user_ID,
              ],
              (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
              }
            );
          });
    
          return { id: response };
        } catch (error) {
          console.error("Database error:", error);
          throw error;
        }
      }
    
    
      // getAllProjectsWithTeam: () => {
      //   return new Promise((resolve, reject) => {
      //     connection.query('SELECT * FROM projects', async (err, projects) => {
      //       if (err) return reject(err);
    
      //       const results = await Promise.all(projects.map(project => {
      //         return new Promise((res, rej) => {
      //           connection.query(`
      //             SELECT u.user_ID, u.full_name, u.Profile_Pic
      //             FROM project_team pt
      //             JOIN user u ON pt.user_ID = u.user_ID
      //             WHERE pt.project_ID = ?
      //           `, [project.project_ID], (err, members) => {
      //             if (err) return rej(err);
      //             res({
      //               project_ID: project.project_ID,
      //               project_name: project.project_name,
      //               progress: project.progress || 0,
      //               team_members: members
      //             });
      //           });
      //         });
      //       }));
    
      //       resolve(results);
      //     });
      //   });
      // }
    
      // // Delete project
      // deleteProject: (projectID) => {
      //   return new Promise((resolve, reject) => {
      //     connection.query('DELETE FROM projects WHERE project_ID = ?', [projectID], (err, result) => {
      //       if (err) return reject(err);
      //       resolve(result);
      //     });
      //   });
      // }
    
      async getProjectsByUser(userID) {
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM projects WHERE user_ID = ?`;
          connection.query(query, [userID], async (err, projects) => {
            if (err) return reject(err);
    
            try {
              const results = await Promise.all(projects.map(project => {
                return new Promise((res, rej) => {
                  const teamQuery = `
                  SELECT u.user_ID, u.fullName, u.Profile_Pic
                  FROM project_team pt
                  JOIN user u ON pt.user_ID = u.user_ID
                  WHERE pt.project_ID = ?
                  `;
                  connection.query(teamQuery, [project.project_ID], (err, members) => {
                    if (err) return rej(err);
                    res({
                      project_ID: project.project_ID,
                      project_name: project.project_name,
                      progress: project.progress || 0,
                      team_members: members
                    });
                  });
                });
              }));
    
              resolve(results);
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    
      // Delete a project by ID
      async deleteProject(projectID) {
        return new Promise((resolve, reject) => {
          const query = `DELETE FROM projects WHERE project_ID = ?`;
          connection.query(query, [projectID], (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
      }
    
      async getJobDetails(jobId) {
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM all_job_list WHERE job_id = ?`;
          connection.query(query, [jobId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Return only the first matching result
          });
        });
      }
    
    //   async getJobPosts({ location, experience, salary, limit, offset }) {
    //     return new Promise((resolve, reject) => {
    //       let baseQuery = `SELECT * FROM all_job_list WHERE 1=1`;
    //       const params = [];
    
    //       if (location) {
    //         baseQuery += ` AND location = ?`;
    //         params.push(location);
    //       }
    
    //       if (experience) {
    //         baseQuery += ` AND experience_level = ?`;
    //         params.push(experience);
    //       }
    
    //       if (salary) {
    //         baseQuery += ` AND salary_range = ?`;
    //         params.push(salary);
    //       }
    
    //       baseQuery += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    //       params.push(parseInt(limit), parseInt(offset));
    
    //       connection.query(baseQuery, params, (err, results) => {
    //         if (err) return reject(err);
    //         resolve(results);
    //       });
    //     });
    //   }

    async getJobPosts({ location, experience, salary, search, limit, offset }) {
        return new Promise((resolve, reject) => {
          let baseQuery = `SELECT * FROM all_job_list WHERE 1=1`;
          const params = [];
      
          if (location) {
            baseQuery += ` AND location LIKE ?`;
            params.push(`%${location}%`);
          }
      
          if (experience) {
            baseQuery += ` AND job_level = ?`;
            params.push(experience);
          }
      
          if (salary) {
            baseQuery += ` AND salary_min >= ?`;
            params.push(parseInt(salary));
          }
      
          if (search) {
            baseQuery += ` AND (job_title LIKE ? OR company_name LIKE ? OR job_description LIKE ?)`;
            const likeSearch = `%${search}%`;
            params.push(likeSearch, likeSearch, likeSearch);
          }
      
          baseQuery += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
          params.push(parseInt(limit), parseInt(offset));
      
          connection.query(baseQuery, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      }

      async getJobCount({ location, experience, salary, search }) {
        return new Promise((resolve, reject) => {
          let countQuery = `SELECT COUNT(*) as total FROM all_job_list WHERE 1=1`;
          const params = [];
      
          if (location) {
            countQuery += ` AND location LIKE ?`;
            params.push(`%${location}%`);
          }
      
          if (experience) {
            countQuery += ` AND job_level = ?`;
            params.push(experience);
          }
      
          if (salary) {
            countQuery += ` AND salary_min >= ?`;
            params.push(parseInt(salary));
          }
      
          if (search) {
            countQuery += ` AND (job_title LIKE ? OR company_name LIKE ? OR job_description LIKE ?)`;
            const likeSearch = `%${search}%`;
            params.push(likeSearch, likeSearch, likeSearch);
          }
      
          connection.query(countQuery, params, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total);
          });
        });
      }
      
      







    ///
    ///Rifat Update>>>>///
    ///

    async getCurrentUserName(user_ID) {
        user_ID = parseInt(user_ID, 10);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE user_ID = ?;";

                connection.query(query, [user_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getAllWorkData(user_ID) {
        user_ID = parseInt(user_ID, 10);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM role WHERE user_ID = ? ORDER BY end_date ASC;";

                connection.query(query, [user_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getAllEduData(user_ID) {
        user_ID = parseInt(user_ID, 10);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user_education WHERE user_ID = ? ORDER BY end_date ASC;";

                connection.query(query, [user_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getAllAddressData(user_ID) {
        try {
            user_ID = parseInt(user_ID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM current_address WHERE user_ID = ? ORDER BY end_date ASC;";

                connection.query(query, [user_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getAllLinksData(user_ID) {
        try {
            user_ID = parseInt(user_ID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM links WHERE user_ID = ?";

                connection.query(query, [user_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertWorkData(user_ID, company_name, position, start_date, end_date) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO role (Company, Field, start_date, end_date, user_ID) VALUES (?,?,?,?,?);";

                connection.query(query, [company_name, position, start_date, end_date, user_ID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(response);
            return {
                id: response
            };
        } catch (error) {
            console.log(error);
        }
    }

    async insertEduData(user_ID, field, college, start_date, end_date) {

        try {
            user_ID = parseInt(user_ID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO user_education (Field, School, start_date, end_date, user_ID) VALUES (?,?,?,?,?);";

                connection.query(query, [field, college, start_date, end_date, user_ID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(response);
            return {
                id: response
            };
        } catch (error) {
            console.log(error);
        }
    }

    async insertAddressData(user_ID, address, start_date, end_date) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO current_address (present_address, start_date, end_date, user_ID) VALUES (?,?,?,?);";

                connection.query(query, [address, start_date, end_date, user_ID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(response);
            return {
                id: response
            };
        } catch (error) {
            console.log(error);
        }
    }

    async insertLink(user_ID, link, site_name) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO links (link, site_name, user_ID) VALUES (?,?,?);";

                connection.query(query, [link, site_name, user_ID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(response);
            return {
                id: response
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteWorkInfo(Role_ID) {
        try {
            Role_ID = parseInt(Role_ID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM role WHERE Role_ID = ?;";

                connection.query(query, [Role_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteEduInfo(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM user_education WHERE edu_list = ?;";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteAddressInfo(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM current_address WHERE list = ?;";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteLinkInfo(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM links WHERE link_id = ?;";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateProfilePic(userID, url) {
        try {
            userID = parseInt(userID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE user SET Profile_Pic = ? WHERE user_ID = ?;";

                connection.query(query, [url, userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateCoverPic(userID, url) {
        try {
            userID = parseInt(userID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE user SET cover_pic = ? WHERE user_ID = ?;";

                connection.query(query, [url, userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameBio(userID, name, bio) {
        try {
            userID = parseInt(userID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE user SET fullName = ?, Bio = ? WHERE user_ID = ?;";

                connection.query(query, [name, bio, userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateWorkInfo(id, company, field, start_date, end_date) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE role SET Company = ?, `Field` = ?, start_date = ?, end_date=? WHERE Role_ID = ?;";

                connection.query(query, [company, field, start_date, end_date, id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateEduInfo(id, college, field, start_date, end_date) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE user_education SET `Field` = ?, School = ?, start_date = ?, end_date=? WHERE edu_list = ?;";

                connection.query(query, [field, college, start_date, end_date, id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchingProfile(ownUserID, name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE fullName Like ? AND user_ID != ?;";

                connection.query(query, [name + '%', ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }


    //  ########################################## by refat ###########################

    async getALLData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select *from user;';
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // async registration(fullName, userName, email, dateOfBirth, gender, pass1) {
    //     try {
    //         const ID = await new Promise((resolve, reject) => {
    //             const query1 = 'INSERT INTO user (fullName, username, Email, Password, DOB, Gender) VALUES (?, ?, ?, ?, ?, ?);';
    //             connection.query(query1, [fullName, userName, email, pass1, dateOfBirth, gender], (err, results) => {
    //                 if (err) {
    //                     reject(new Error(err.message));
    //                 } else {
    //                     resolve(results.insertId);  // Get the auto-incremented ID from results
    //                 }
    //             });

    //         });

    //         const query2 = "INSERT INTO universal_location (Latitude, Longitude, user_ID) VALUES (?,?,?);";
    //             connection.query(query2, [0, 0, ID], (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result);
    //             })

    //         // console.log("db id ", ID);
    //         return { success: true, message: 'Registration successful', ID: ID };
    //     } catch (error) {
    //         console.log(error);
    //         return { success: false, message: error.message };
    //     }
    // }
    async incrementActivityIfNotExists(column, userID, postID) {
        try {
            // Check if the post_ID and user_ID already exist in the activity_tracker table
            const exists = await new Promise((resolve, reject) => {
                const checkQuery = `SELECT * FROM activity_tracker WHERE post_ID = ? AND user_ID = ?`;
                connection.query(checkQuery, [postID, userID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result.length > 0);  // If result length > 0, the post_ID and user_ID exist
                    }
                });
            });

            if (exists) {
                // console.log('The post_ID and user_ID already exist. Increment will not happen.');
                return { success: false, message: 'Record already exists' };  // Skip increment if the combination exists
            } else {
                // Proceed with incrementing the activity column if it doesn't exist
                const response = await new Promise((resolve, reject) => {
                    const updateQuery = `UPDATE universal_progress SET ?? = ?? + ? WHERE user_ID = ?`;
                    connection.query(updateQuery, [column, column, 1, userID], (err, result) => {
                        if (err) {
                            reject(new Error(err.message));
                        } else {
                            resolve(result);
                        }
                    });
                });

                console.log('Activity incremented successfully!');
                return { success: true, result: response };  // Return the result from the query
            }
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;  // Rethrow the error if needed
        }
    }

    async insertUserPostActivity(user_ID, post_ID) {
        try {
            const checkQuery = `SELECT * FROM  activity_tracker WHERE user_ID = ? AND post_ID = ?`;
            const checkResult = await new Promise((resolve, reject) => {
                connection.query(checkQuery, [user_ID, post_ID], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });

            if (checkResult.length > 0) {
                // Record already exists
                return { success: false, message: 'Record already exists' };
            } else {
                // Proceed with the insertion
                const insertQuery = `INSERT INTO  activity_tracker (user_ID, post_ID) VALUES (?, ?)`;
                const insertResult = await new Promise((resolve, reject) => {
                    connection.query(insertQuery, [user_ID, post_ID], (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
                return { success: true, postID: post_ID };
            }
        } catch (error) {
            console.error('Error inserting user post activity:', error);
            throw error;
        }
    }

    async registration(fullName, userName, email, dateOfBirth, gender, pass1) {
        try {
            // First query (Inserting into 'user' table)
            const ID = await new Promise((resolve, reject) => {
                const query1 = 'INSERT INTO user (fullName, username, Email, Password, DOB, Gender) VALUES (?, ?, ?, ?, ?, ?);';
                connection.query(query1, [fullName, userName, email, pass1, dateOfBirth, gender], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.insertId);  // Get the auto-incremented ID from results
                    }
                });
            });

            // Second query (Inserting into 'universal_location' table)
            await new Promise((resolve, reject) => {
                const query2 = "INSERT INTO universal_location (Latitude, Longitude, user_ID) VALUES (?,?,?);";
                connection.query(query2, [0, 0, ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result);  // Resolve the second query's promise
                    }
                });
            });
            await new Promise((resolve, reject) => {
                const query3 = "INSERT INTO  universal_progress (activity_permission,user_ID) VALUES (?,?);";
                connection.query(query3, ['no', ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result);  // Resolve the second query's promise
                    }
                });
            });

            return { success: true, message: 'Registration successful', ID: ID };
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }


    async insertRegistrationProfilePic(userID, imageUrl) {
        try {
            const ID = await new Promise((resolve, reject) => {
                const query = 'UPDATE user set Profile_Pic=? where user_ID =?;';
                connection.query(query, [imageUrl, userID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {
                        resolve(results.ID);
                    }
                })
            });
            return { success: true, ID: ID };
            // console.log(ID);
            // return response;
        } catch (error) {
            console.log(error);
            // console.log("yes dbservice");
            return { success: false, message: error.message };
        }
    }
    async insertRegistrationCoverPic(userID, imageUrl) {
        try {
            const ID = await new Promise((resolve, reject) => {
                const query = 'UPDATE user set cover_pic=? where user_ID =?;';
                connection.query(query, [imageUrl, userID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {
                        resolve(results.ID);
                    }
                })
            });
            return { success: true, ID: ID };
            // console.log(ID);
            // return response;
        } catch (error) {
            console.log(error);
            // console.log("yes dbservice");
            return { success: false, message: error.message };
        }
    }
    // async addPost(Caption,content,Category_Name, Privacy,userName){
    //     var postIdStore;
    //     try {

    //         const postID = await new Promise((resolve, reject)=>{
    //             const query = 'INSERT INTO post (Caption, content, Category_Name, Privacy, user_ID) VALUES (?, ?, ?, ?, (SELECT user_ID FROM user WHERE username = ?))';

    //             connection.query(query,[Caption,content,Category_Name, Privacy, userName],(err,results)=>{
    //                 if (err) {
    //                     reject (new Error(err.message));
    //                 }
    //                 else {

    //                     // this.insertPostFile(results.insertId,imageUrl)
    //                     postIdStore = results.insertId;
    //                     resolve(results);
    //                 }
    //             })
    //             // console.log("hello post"+postIdStore);
    //         });
    //         const response = await new Promise((resolve, reject)=>{
    //             const query = 'select post_ID from `post` where (SELECT user_ID FROM user WHERE username = ?) and post_ID = ? ';
    //             connection.query(query,[userName, postIdStore],(err,results)=>{
    //                 if (err) reject (new Error(err.message));
    //                 resolve(results);
    //             })
    //         });
    //         // console.log(response);
    //         return response;

    //         // return { success: true, message: 'Post created successfully', postID};
    //         // console.log(ID);
    //         // return response;
    //     } catch (error) {
    //         console.log(error);
    //         // console.log("yes dbservice");
    //         return { success: false, message: error.message };
    //     }
    // }


    async getFilteredPosts(categories) {
        try {
            const sqlQuery = `SELECT * FROM post WHERE Category_Name IN (?) AND Privacy = 'public' ORDER BY Created_Date DESC`;

            return new Promise((resolve, reject) => {
                connection.query(sqlQuery, [categories], (err, results) => {
                    if (err) {
                        console.error("Error executing query: ", err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        } catch (err) {
            console.error("Database error: ", err);
            throw err;
        }
    }

    async addPost(Caption, content, Category_Name, Privacy, userName) {
        try {
            const postID = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO post (Caption, content, Category_Name, Privacy, user_ID) VALUES (?, ?, ?, ?, (SELECT user_ID FROM user WHERE username = ?))';

                connection.query(query, [Caption, content, Category_Name, Privacy, userName], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.insertId); // Get the postID from the insertId
                    }
                });
            });

            return { success: true, postID }; // Return postID
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }


    async getUserName(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from user where user_ID = ?';
                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getAllPost() {
        try {
            const response = await new Promise((resolve, reject) => {
                // const query = 'select * from post ORDER BY `Created_date` DESC;';
                const query = `SELECT * FROM post WHERE privacy != 'private' ORDER BY Created_date DESC`;
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getPostFile(post_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select file_url FROM `post_image` WHERE post_ID = ?;';
                connection.query(query, [post_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log("db -"+post_ID);

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async insertPostFile(postID, imageURL) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO post_image (post_ID, file_url) VALUES (?,?);";

                connection.query(query, [postID, imageURL], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(response);
            return {
                id: response,
                imageURL: imageURL
            };
        } catch (error) {
            console.log(error);
        }
    }
    async updatePostLike(userName, post_ID) {
        try {
            post_ID = parseInt(post_ID, 10);
            const userID = await new Promise((resolve, reject) => {
                const userQuery = 'SELECT user_ID FROM user WHERE username = ?';
                connection.query(userQuery, [userName], (err, results) => {
                    if (err) {
                        return reject(new Error(err.message));
                    }
                    // Assuming results[0] contains the user object
                    if (results.length === 0) {
                        return reject(new Error('User not found'));
                    }
                    resolve(results[0].user_ID); // Assuming user_ID is the field name
                });
            });
            const response = await new Promise((resolve, reject) => {

                connection.query('SELECT user_ID from reaction where (state = ? and user_ID =? and post_ID = ?);', ["dislike", userID, post_ID], function (error, results) {
                    if (error) {
                        // Handle error
                        console.error('Error executing query:', error);
                        return;
                    }

                    // Check if results are empty
                    if (results.length === 0) {
                        // console.log('No posts found for this user');
                        connection.query('SELECT user_ID from reaction where (state = ? and user_ID =? and post_ID = ?);', ["like", userID, post_ID], function (error, results) {
                            if (error) {
                                // Handle error
                                console.error('Error executing query:', error);
                                return;
                            }

                            // Check if results are empty
                            if (results.length === 0) {
                                // console.log('No posts found for this user');
                                const query = "UPDATE `post` SET Like_Count = (SELECT Like_Count from `post` where post_ID = ?)+1 where post_ID = ? ;";
                                connection.query(query, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                                const query2 = "INSERT INTO reaction (state, user_ID, post_ID) VALUES (?, ?, ?)";
                                connection.query(query2, ["like", userID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                            } else {
                                console.log('Posts found1:', results);
                                const query1 = "UPDATE `post` SET Like_Count = (SELECT Like_Count from `post` where post_ID = ?)-1 where post_ID = ? ;";
                                connection.query(query1, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                                const query2 = "DELETE FROM reaction WHERE post_ID = ?";
                                connection.query(query2, [post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                            }
                        });
                    } else {
                        connection.query('SELECT user_ID from reaction where (state = ? and user_ID =? and post_ID = ?);', ["like", userID, post_ID], function (error, results) {
                            if (error) {
                                // Handle error
                                console.error('Error executing query:', error);
                                return;
                            }

                            // Check if results are empty
                            if (results.length === 0) {
                                console.log('No posts found for this user');
                                const query = "UPDATE `post` SET Like_Count = (SELECT Like_Count from `post` where post_ID = ?)+1 where post_ID = ? ;";
                                connection.query(query, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                });
                                const query2 = "UPDATE reaction set state = ? where (user_ID =? and post_ID = ?)";
                                connection.query(query2, ["like", userID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                });
                                const query1 = "UPDATE `post` SET Dislike_Count = (SELECT Dislike_Count from `post` where post_ID = ?)-1 where post_ID = ? ;";
                                connection.query(query1, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                });
                            } else {
                                console.log('Posts found2:', results);
                            }
                        });
                    }
                });
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async updatePostDisLike(userName, post_ID) {
        try {
            post_ID = parseInt(post_ID, 10);
            const userID = await new Promise((resolve, reject) => {
                const userQuery = 'SELECT user_ID FROM user WHERE username = ?';
                connection.query(userQuery, [userName], (err, results) => {
                    if (err) {
                        return reject(new Error(err.message));
                    }
                    // Assuming results[0] contains the user object
                    if (results.length === 0) {
                        return reject(new Error('User not found'));
                    }
                    resolve(results[0].user_ID); // Assuming user_ID is the field name
                });
            });
            const response = await new Promise((resolve, reject) => {
                connection.query('SELECT user_ID from reaction where (state = ? and user_ID =? and post_ID = ?);', ["like", userID, post_ID], function (error, results) {
                    if (error) {
                        // Handle error
                        console.error('Error executing query:', error);
                        return;
                    }

                    // Check if results are empty
                    if (results.length === 0) {
                        // console.log('No posts found for this user');
                        connection.query('SELECT user_ID from reaction where (state = ? and user_ID =? and post_ID = ?);', ["dislike", userID, post_ID], function (error, results) {
                            if (error) {
                                // Handle error
                                console.error('Error executing query:', error);
                                return;
                            }

                            // Check if results are empty
                            if (results.length === 0) {
                                // console.log('No posts found for this user');
                                const query = "UPDATE `post` SET Dislike_Count = (SELECT Dislike_Count from `post` where post_ID = ?)+1 where post_ID = ? ;";
                                connection.query(query, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                                const query2 = "INSERT INTO reaction (state, user_ID, post_ID) VALUES (?, ?, ?)";
                                connection.query(query2, ["dislike", userID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                            } else {
                                console.log('Posts found3:', results);
                                const query1 = "UPDATE `post` SET Dislike_Count = (SELECT Dislike_Count from `post` where post_ID = ?)-1 where post_ID = ? ;";
                                connection.query(query1, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                                const query2 = "DELETE FROM reaction WHERE post_ID = ?";
                                connection.query(query2, [post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                            }
                        });
                    } else {
                        connection.query('SELECT user_ID from reaction where (state = ? and user_ID =? and post_ID = ?);', ["dislike", userID, post_ID], function (error, results) {
                            if (error) {
                                // Handle error
                                console.error('Error executing query:', error);
                                return;
                            }

                            // Check if results are empty
                            if (results.length === 0) {
                                // console.log('No posts found for this user');
                                const query = "UPDATE `post` SET Dislike_Count = (SELECT Dislike_Count from `post` where post_ID = ?)+1 where post_ID = ? ;";
                                connection.query(query, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                                const query2 = "UPDATE reaction set state = ? where (user_ID =? and post_ID = ?)";
                                connection.query(query2, ["dislike", userID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })
                                const query1 = "UPDATE `post` SET Like_Count = (SELECT Like_Count from `post` where post_ID = ?)-1 where post_ID = ? ;";
                                connection.query(query1, [post_ID, post_ID], (err, results) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(results);
                                })

                            } else {
                                console.log('Posts found4:', results);

                            }
                        });
                    }
                });

            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async gettingCurrentUserInfo(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE username = ?;";

                connection.query(query, [username], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async gettingFriendsInfo(userID) {
        try {
            userID = parseInt(userID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM friends f
                                JOIN user u ON (u.user_ID = CASE 
                                                            WHEN f.user_ID = ? THEN f.Friend_ID 
                                                            ELSE f.user_ID 
                                                END)
                                WHERE (f.user_ID = ? OR f.Friend_ID = ?)
                                AND f.status = ?;`;

                connection.query(query, [userID, userID, userID, 'YES'], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async gettingFollowersInfo(userID, x) {
        try {
            userID = parseInt(userID, 10);
            const response = await new Promise((resolve, reject) => {
                let query = '';
                if (x === 'Followers')
                    query = "SELECT * FROM followings WHERE Following_ID = ?;";
                else if (x === 'Followings')
                    query = "SELECT * FROM followings WHERE user_ID = ?;";

                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async searchingFriendStatus(ownUserID, otherUserID, x) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = ''

                if (x === 0) {
                    query = "SELECT * FROM friends WHERE user_ID = ? AND Friend_ID = ? AND status = ? OR user_ID = ? AND Friend_ID = ? AND status = ?;";

                    connection.query(query, [ownUserID, otherUserID, 'YES', otherUserID, ownUserID, 'YES'], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                }
                else if (x === 1) {
                    query = "SELECT * FROM friends WHERE user_ID = ? AND Friend_ID = ? AND status = ?";

                    connection.query(query, [ownUserID, otherUserID, 'NO'], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                }
                else if (x === 2) {
                    query = "SELECT * FROM friends WHERE user_ID = ? AND Friend_ID = ? AND status = ?";

                    connection.query(query, [otherUserID, ownUserID, 'NO'], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                }
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async AcceptFriendReq(ownUserID, otherUserID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE friends SET status = ? WHERE user_ID = ? AND Friend_ID = ?;";

                connection.query(query, ['YES', otherUserID, ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async insertingFriendReq(ownUserID, otherUserID) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO friends (user_ID, Friend_ID, status) VALUES (?,?,?);";

                connection.query(query, [ownUserID, otherUserID, 'NO'], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            // console.log(response);
            return {
                id: response,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async cancelFriendReq(ownUserID, otherUserID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM friends WHERE user_ID = ? AND Friend_ID = ? OR user_ID = ? AND Friend_ID = ?;";

                connection.query(query, [ownUserID, otherUserID, otherUserID, ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async locationPermission(ownUserID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE user_ID = ?;";

                connection.query(query, [ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async updateLocationPermission(ownUserID, x) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query1 = "UPDATE user SET location_permission = ? WHERE user_ID = ?;";

                if (x === 0) {
                    connection.query(query1, ['no', ownUserID], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results.affectedRows);
                    })
                }
                else if (x === 1) {
                    connection.query(query1, ['yes', ownUserID], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results.affectedRows);
                    })
                }
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // async deleteLocation(ownUserID){
    //     try {
    //         const response = await new Promise((resolve, reject) =>{
    //             const query = "DELETE FROM universal_location WHERE user_ID = ?;";

    //             connection.query(query, [ownUserID] , (err, results) =>{
    //                 if(err) reject(new Error(err.message));
    //                 resolve(results.affectedRows);
    //             })
    //         })

    //         return response === 1 ? true : false;

    //     } catch (error) {
    //         console.log(error);
    //         return false;
    //     }
    // }

    async insertLocationInfo(ownUserID, latitude, longitude, DateTime) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE universal_location SET Latitude = ?, Longitude = ?, Date_Time = ? WHERE user_ID = ?;";

                connection.query(query, [latitude, longitude, DateTime, ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async sendingLocationPermission(ownUserID, otherUserID, x) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "UPDATE friends SET Location_Permission = ?, location_req_sender = ? WHERE user_ID = ? AND Friend_ID = ? OR user_ID = ? AND Friend_ID = ?;";

                if (x === 0) {
                    connection.query(query, ['NO', ownUserID, ownUserID, otherUserID, otherUserID, ownUserID], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results.affectedRows);
                    })
                }
                else if (x === 1) {
                    connection.query(query, [null, 0, ownUserID, otherUserID, otherUserID, ownUserID], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results.affectedRows);
                    })
                }
                else if (x === 2) {
                    query = "UPDATE friends SET Location_Permission = ? WHERE user_ID = ? AND Friend_ID = ? OR user_ID = ? AND Friend_ID = ?;";
                    connection.query(query, ['YES', ownUserID, otherUserID, otherUserID, ownUserID], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results.affectedRows);
                    })
                }
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async gettingSpecificLocation(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM universal_location WHERE user_ID = ?;";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async gettingNameofSender(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user WHERE user_ID = ?;";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertNotification(notification_text, id) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO notification (Message, user_ID) VALUES (?,?);";

                connection.query(query, [notification_text, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id: response,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async searchingNotification(ownUserID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM notification WHERE user_ID = ? ORDER BY Notification_ID DESC;";

                connection.query(query, [ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async gettingFriendReqInfo(userID) {
        try {
            userID = parseInt(userID, 10);
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * from friends f JOIN user u 
                                on f.user_ID = u.user_ID WHERE (f.Friend_ID = ? and f.status = ?)`;

                connection.query(query, [userID, 'NO'], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async gettingMutualFriend(ownUserID, otherUserID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM friends f
                               JOIN user u ON (u.user_ID = CASE 
                                                    WHEN f.user_ID = ? THEN f.Friend_ID 
                                                    ELSE f.user_ID 
                                                END)
                                WHERE 
                                    (f.user_ID = ? OR f.Friend_ID = ?)
                                    AND f.status = 'YES'
                                    AND u.user_ID IN (
                                        SELECT 
                                            u2.user_ID
                                        FROM 
                                            friends f2
                                        JOIN 
                                            user u2
                                            ON (u2.user_ID = CASE 
                                                            WHEN f2.user_ID = ? THEN f2.Friend_ID 
                                                            ELSE f2.user_ID 
                                                        END)
                                        WHERE 
                                            (f2.user_ID = ? OR f2.Friend_ID = ?)
                                            AND f2.status = 'YES'
                                    )
                                ORDER BY 
                                    u.fullName ASC;`;

                connection.query(query, [ownUserID, ownUserID, ownUserID, otherUserID, otherUserID, otherUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertUserReport(id, problemType, problemDescription) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO problem_report (problem,	details, reporting_user_ID) VALUES (?,?,?);";

                connection.query(query, [problemType, problemDescription, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            // console.log(response);
            return {
                id: response,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async searchingReport(ownUserID, post_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM post_report WHERE user_ID = ? AND post_ID = ?;";

                connection.query(query, [ownUserID, post_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertNewReport(ownUserID, post_ID) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO post_report (user_ID, post_ID) VALUES (?,?);";

                connection.query(query, [ownUserID, post_ID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            // console.log(response);
            return {
                id: response,
            };
        } catch (error) {
            console.log(error);
        }
    }

    ///
    // Rifat
    //
    async getAllFriendListForMessenger(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT 
                            u.user_ID, u.fullName, u.Profile_Pic
                            FROM friends f
                            JOIN user u
                                ON (u.user_ID = CASE 
                                                WHEN f.user_ID = ? THEN f.Friend_ID 
                                                ELSE f.user_ID 
                                            END)
                            WHERE (f.user_ID = ? OR f.Friend_ID = ?)
                            AND f.status = 'YES'
                            ORDER BY u.fullName ASC;`

                connection.query(query, [userID, userID, userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(userID);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getMessagesBetweenFriends(userID, friendID) {
        // console.log("db.js: "+userID+" "+friendID);
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * 
                FROM messenger 
                WHERE (user_ID = ? AND friends_ID = ?) 
                   OR (user_ID = ? AND friends_ID = ?)
                ORDER BY message_Date, message_Time`;

            connection.query(query, [userID, friendID, friendID, userID], (err, results) => {
                if (err) {
                    return reject(err);
                }
                // console.log(results);
                resolve(results);
            });
        });
    }
    async messagersTextStoreToDatabase(MyID, targetFriend_ID, messageText) {
        try {
            const postID = await new Promise((resolve, reject) => {
                const query = `INSERT INTO messenger (user_ID, friends_ID, message_content)
                                VALUES 
                                    (?,?,?);`

                connection.query(query, [MyID, targetFriend_ID, messageText], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.insertId); // Get the postID from the insertId
                    }
                });
            });

            return { success: true, postID }; // Return postID
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }
    //
    async userStatistics() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT 
                  DATE_FORMAT(Joined_date, '%Y-%m') AS month,
                  COUNT(*) AS total_users,
                  SUM(CASE WHEN Gender = 'male' THEN 1 ELSE 0 END) AS male_users,
                  SUM(CASE WHEN Gender = 'female' THEN 1 ELSE 0 END) AS female_users
                FROM user
                GROUP BY month
                ORDER BY month;
              `;
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async deleteUserByAdmin(user_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM user where user_ID = ?;';
                connection.query(query, [user_ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Database deletion failed");
        }
    }
    async getAllPostForAdmin() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select post_ID,p.user_ID,fullName,username from post p join user u on p.user_ID = u.user_ID ORDER BY `post_ID` ASC;';
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getAllProblemOfUser() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select report_ID,user_ID,fullName,username,problem,details,Date_Time from problem_report join user on reporting_user_ID = user_ID ORDER BY report_ID ASC;';
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getAllPostReport() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT 
                                    u1.user_ID AS reporter_user_ID,
                                    u1.fullName AS reporter_fullName,
                                    u2.user_ID AS post_owner_user_ID,
                                    u2.fullName AS post_owner_fullName,
                                    p.post_ID
                                FROM 
                                    post_report pr
                                JOIN 
                                    post p ON pr.post_ID = p.post_ID
                                JOIN 
                                    user u1 ON pr.user_ID = u1.user_ID  -- Reporter details
                                JOIN 
                                    user u2 ON p.user_ID = u2.user_ID   -- Post owner details
                                ORDER by pr.post_ID ASC `;
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async deletePostByAdmin(post_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM post where post_ID = ?;';
                connection.query(query, [post_ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Database deletion failed");
        }
    }
    async deleteProblemByAdmin(report_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM problem_report where report_ID = ?;';
                connection.query(query, [report_ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Database deletion failed");
        }
    }
    //

    async getAllActivity(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT *FROM `universal_progress` WHERE user_ID = ?;'
                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(userID);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    //
    async getAllAlarmList(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM personalized_notification WHERE user_ID = 6 ORDER BY Created_Date ASC, Notify_Time ASC;';  // Use ? for parameterized query
                connection.query(query, [userID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            throw new Error("Database query failed");  // Throw error so it can be caught in app.js
        }
    }
    async deleteExpiredAlarm(P_Notified_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM personalized_notification WHERE P_Notified_ID = ?';
                connection.query(query, [P_Notified_ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Database deletion failed");
        }
    }
    async deletAlarm(alarmID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM personalized_notification WHERE P_Notified_ID = ?;';  // Use ? for parameterized query
                connection.query(query, [alarmID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            throw new Error("Database query failed");  // Throw error so it can be caught in app.js
        }
    }
    async setAlarm(date, time, levelOfAlarm, message, user_ID) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO personalized_notification (Notify_Time,Created_Date,Content,alarm_level,user_ID	) VALUES (?, ?, ?, ?, ?)';
                connection.query(query, [time, date, message, levelOfAlarm, user_ID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ success: true, id: results.insertId });
                    }
                });
            });
            return result;
        } catch (error) {
            console.error('Database error:', error);
            return { success: false };
        }
    }

    async getAllPostPerOwner(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from post WHERE user_ID = ? ORDER BY `Created_date` DESC;';
                // const query = `SELECT * FROM post WHERE (privacy != 'private') and (user_ID = ?) ORDER BY 'Created_date' DESC`;
                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async getAllPostPerUser(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                // const query = 'select * from post WHERE user_ID = ? ORDER BY `Created_date` DESC;';
                const query = `SELECT * FROM post WHERE (privacy != 'private') and (user_ID = ?) ORDER BY 'Created_date' DESC`;
                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAlarmDataForFeed(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT *FROM personalized_notification where user_ID =? ORDER BY CONCAT(Created_Date, \' \', Notify_Time) ASC LIMIT 1;'
                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(userID);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async DeletePost(ownUserID, post_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM post WHERE post_ID = ? AND user_ID = ?;";

                connection.query(query, [post_id, ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchingSave(ownUserID, post_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM save_post WHERE user_ID = ? AND post_ID = ?;";

                connection.query(query, [ownUserID, post_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertSavePost(ownUserID, post_id) {

        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO save_post (user_ID, post_ID) VALUES (?, ?);";

                connection.query(query, [ownUserID, post_id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id: response,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteSavedPost(ownUserID, post_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM save_post WHERE user_ID = ? AND post_ID = ?;";

                connection.query(query, [ownUserID, post_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getAllSavedPost(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM save_post 
                                join user on user.user_ID = save_post.user_ID
                                join post on post.post_ID = save_post.post_ID
                                WHERE save_post.user_ID = ? ORDER BY post.Created_Date DESC`;

                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchingFriend(ownUserID, name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM friends f
                                JOIN user u ON (u.user_ID = CASE 
                                                            WHEN f.user_ID = ? THEN f.Friend_ID 
                                                            ELSE f.user_ID 
                                                END)
                                WHERE (f.user_ID = ? OR f.Friend_ID = ?)
                                AND f.status = "YES" AND fullName like ?;`;

                connection.query(query, [ownUserID, ownUserID, ownUserID, name + '%'], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async addProductToMarketplace(itemTitle, itemDescription, category, price, contactNumber, contactEmail, location, user_ID) {

        try {
            const postID = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO marketplace (Title, Description, Seller_Number, Seller_Email, location, Category, Price, user_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

                connection.query(query, [itemTitle, itemDescription, contactNumber, contactEmail, location, category, price, user_ID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.insertId); // Get the postID from the insertId
                    }
                });
            });

            return { success: true, postID }; // Return postID
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }

    async insertProductFile(postID, imageURL) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO item_image (item_ID, file_url) VALUES (?,?);";

                connection.query(query, [postID, imageURL], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(response);
            return {
                id: response,
                imageURL: imageURL
            };
        } catch (error) {
            console.log(error);
        }
    }

    async getAllProduct() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from marketplace ORDER BY `Date` DESC;';
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getUserProduct(user_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from marketplace WHERE user_ID = ? ORDER BY `Date` DESC;';
                connection.query(query, [user_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async updateItem({ item_ID, Title, Description, location, Price, Seller_Number, Seller_Email }) {
        const query = `
        UPDATE marketplace
        SET Title = ?, Description = ?, location = ?, Price = ?, Seller_Number = ?, Seller_Email = ?
        WHERE item_ID = ?
    `;

        return new Promise((resolve, reject) => {
            connection.query(query, [Title, Description, location, Price, Seller_Number, Seller_Email, item_ID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    async deleteMarketplaceItem(item_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query1 = "DELETE FROM item_image WHERE item_ID = ?;";
                const query2 = "DELETE FROM marketplace WHERE item_ID = ?;";

                connection.query(query1, [item_ID], (err) => {
                    if (err) return reject(new Error(err.message));
                    connection.query(query2, [item_ID], (err, results) => {
                        if (err) return reject(new Error(err.message));
                        resolve(results.affectedRows);
                    });
                });
            });

            return response === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Get messages between two users (ordered chronologically)
    async getMessagesBetweenUsers(user1, user2) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
                    SELECT * FROM messenger 
                    WHERE (senderID = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)
                    ORDER BY time_date ASC`;
                connection.query(query, [user1, user2, user2, user1], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async sendMessage(senderID, receiverID, message_content) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `INSERT INTO messenger (senderID, receiverID, message_content) VALUES (?, ?, ?)`;
                connection.query(query, [senderID, receiverID, message_content], (err, results) => {
                    if (err) return reject(err);
                    resolve(results.affectedRows === 1);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getConversationUsers(currentUserID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `
                SELECT 
                    u.user_ID, 
                    u.fullName, 
                    u.Profile_Pic,
                    MAX(m.time_date) AS last_message_time
                FROM user u
                JOIN messenger m 
                  ON (u.user_ID = m.senderID AND m.receiverID = ?) 
                  OR (u.user_ID = m.receiverID AND m.senderID = ?)
                WHERE u.user_ID != ?
                GROUP BY u.user_ID, u.fullName, u.Profile_Pic
                ORDER BY last_message_time DESC
            `;
                connection.query(query, [currentUserID, currentUserID, currentUserID], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }





    async getItemFile(item_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select file_url FROM `item_image` WHERE item_ID = ?;';
                connection.query(query, [item_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log("db -"+post_ID);

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllProductperUser(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from marketplace WHERE user_ID = ? ORDER BY `Date` DESC;';
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // async searching_product(text) {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const query = `SELECT * FROM marketplace where Title like ?`;

    //             connection.query(query, ['%'+text+'%'], (err, results) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(results);
    //             })
    //         })

    //         return response;

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async searching_product(text, category) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = `SELECT * FROM marketplace WHERE Title LIKE ?`;
                const values = [`%${text}%`];

                if (category && category !== 'all') {
                    query += ` AND Category = ?`;
                    values.push(category);
                }

                connection.query(query, values, (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    }


    async getPostComment(postID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select user.user_ID,fullName,Profile_Pic,Content,time from comment JOIN user on comment.user_ID = user.user_ID WHERE post_ID = ?;';
                connection.query(query, [postID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    // console.log(results);
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async storePostCommentByViewrs(user_ID, post_ID, commentText) {
        try {
            const postID = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO comment (Content,user_ID,post_ID) VALUES (?, ?, ?)';

                connection.query(query, [commentText, user_ID, post_ID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results.insertId); // Get the postID from the insertId
                    }
                });
            });

            return { success: true, postID }; // Return postID
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }

    async getAllActivity(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM universal_progress WHERE user_ID = ?;'
                connection.query(query, [userID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(userID);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async DeleteItem(ownUserID, post_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM marketplace WHERE item_ID = ? AND user_ID = ?;";

                connection.query(query, [post_id, ownUserID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results.affectedRows);
                })
            })

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getProductByCategory(category) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM marketplace WHERE Category = ? ORDER BY `Date` DESC;';
                connection.query(query, [category], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductByItemID(item_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM marketplace WHERE item_ID = ? ORDER BY `Date` DESC;';
                connection.query(query, [item_ID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getUserInfoByUserID(seller_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM user WHERE user_ID = ?;';
                connection.query(query, [seller_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = dbService;