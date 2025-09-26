# project name expense manager 
## Features 
    - date of expense entry * 
    - data entry by typing 
    - fields 
      - date (date picker)
      - name (character limit)
      - reason (fixed names/categories) scrollable
        - bills 
        - leisure 
        - eat drink 
        - travel 
        - misc
        - bill split with friends, open calculator
          - total bill 
          - number of people 


      
    - monthly expense chart (chart maker) optional ****
    - limit, app locks after limit expires ***
    - expense reaching limit triggers email ** 
        - total expense limit suggestions 
      - per day expenditure togglable 
        - suggested options (5,000) etc 
      - bills subtracts from total limit
    - mentions total expenditures of previous months in a list or in a table *****
    - profile management 
  
## stack / technologies used 
    - persistance 
    - portable or for android mobile, 
    - application maker 
    - familiar programming language
    - authentication 
  
## requirements 
    - database remote 
    - mobile 
    - database hosting 
    - laptop which supports mobile development
      - react native cli
      - expo 
  
## Target audience 
    - students 
      - short attention span 
      - in a hurry 
      - notifications atleast 3 times a day 
        - at 11 am their local time 
        - 3 pm their local time 
        - 6 pm their local time 
    - job wale log 
      - bills allocation shown only to job wale log 
  
## Future ideas 
    - paid subscription: lets user make project, monthyl setup by editing all categories monthly limit for example 
    - lets user make their own categories within categories 
      - leisure 10,000 rs etc


## Flow 
    - animated logo open up 
    - app opens up 
    - first time user 
      - student / working 
      - student 
        - settings required 
          - make or signin to account (email or google)
          - monthly limit 
          - daily limit 
          - notification times 3 times a day (show suggested)
          - permissions take 
          - then shown normal ui 

      - working 
        - settings required
          - make or signin to account (email or google)
          - monthly limit 
          - daily limit 
          - notification times 3 times a day (show suggested)
          - permissions take 
          - monthly salary 
          - monthly bills allocation 
          - saving allocation from monthly salary 
          - monthly goal for saving 
          - then shown normal ui 

    - 2nd time user /normal ui 
      - checks if user is 2nd time user 
      - profile button lets edit settings and logout, dark mode
      - at the top 3 dots toggling type of view shown, charts, data entry, or monthly expenses 
      - data entry fields show up
      - at the top thermometer type horizontal showing total expenditure based on limit 


## UI and architecture choices 
    - make your own figma ui screens  
    - for testing use local db, local hosting.
      - finalise a basic design (kamrans task)
    - or follow and copy someone elses 
    - datbase model creation
    - ui features enable one at a time 

## specific technologies choices 
    - nosql or mysql = nosql 
    - hosting = varcel 
    - database hosting platform = mongo db, atlas
  
