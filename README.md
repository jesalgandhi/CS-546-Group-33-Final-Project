# Roommate Roulette

Welcome to **Roommate Roulette!** 

## Overview

Roommate Roulette is an application designed to help you find the perfect roommate(s) for your living situation. Whether you're searching for a single roommate or a group, this tool simplifies the process of finding compatible housemates.

## How To Get Started
1. Register as a new account.
2. After registration, login with your credentials.
3. Create your group.
4. When your group is created, you can invite other people into your group by telling other users the group username and group password that you set up.
5. Now that you and your roommates are in the group, start searching for your future roommates!
   - Suggested List of Groups takes into account the number of roommates you are looking for, budget, radius, and other applied filters
6. When you find someone who matches what your group is looking for, you may match with them
   - Click on add match, this will add the group to your pending matches 
7. If they match with you back, contact info is released between the 2 groups and you are able to message each other onsite.
   - When the other group has also matched with you, you will be able to see the group be removed from suggested matches and added to your matches.
8. In Matches you can message groups in a group message system, create reviews for the group, and unmatch the group
9. The settings page is where users can change crucial information about their account, and the admin of the group can also access the group settings page to change group information.

## Extra Features
 1. The ability to **filter** the groups you see based on numerous fields, such as: similar budgets, common group interests, etc.
 2. For security purposes:
      -  the option to **unmatch** a group that you no longer wish to share contact info with, deleting your match from both groups' matches.
 3. **Pending matches**, groups that you are waiting to match back with.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Jquery, Handlebars
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Installation

1. **Clone the repository:**

   ```bash
   $ git clone https://github.com/jesalgandhi/CS-546-Group-33-Final-Project
   $ cd CS-546-Group-33-Final-Project
   ```

2. **Install Dependencies:**

   ```bash
   $ npm i
   ```

3. **Seed the Database:**

   ```bash
   $ npm run seed
   ```
- The <u>password</u> for all the users from the seed file is **Test123$**. The <u>groupPassword</u> for all of the groups from the seed file is **RandomPassword**.

4. **Start the Application:**

   ```bash
   $ npm start
   ```

## Notes
- Before starting the server, please ensure you are deauthenticated. If you are still authenticated from a previous server session (e.g. you were logged in and Ctrl+C on the server while logged in), go to `/logout` after starting the server again.
- For your leisure, we used saltRounds of 8 for the passwords so the seed file finishes in a timely manner. Had we used the intended (more secure) 16 saltRounds, the seed file takes significantly longer to hash the passwords of all ~300 of our users.


## Contributors
This project was a collaborative effort by: 
<a href="https://github.com/jesalgandhi">jesalgandhi</a>, <a href="https://github.com/dhihana">dhihana</a>, <a href="https://github.com/jacobgrocks1234">jacobgrocks1234</a>, <a href="https://github.com/adarshgogineni">adarshgogineni</a>, <a href="https://github.com/calvin526">calvin526</a>.
