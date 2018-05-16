---
title: "Data Collection"
author: Amber Thomas
date: April 26, 2018
output:
  html_document:
    collapsed: FALSE
    theme: cosmo
    toc: yes
    toc_float: yes
    toc_depth: 2
    df_print: paged
---



## Background

This project exists to explore the use of various types of contraceptives by women and people with female-assigned reproductive systems in the United States. 

### Data Source(s)

All data from this project is collected by the Centers for Disease Control and Prevention (CDC) through the National Survey of Family Growth (NSFG). Surveys of this nature have been conducted since 1973 and originally only involved female respondents. After 2002, this survey consists of both a "Male" and "Female" survey, but for the purposes of this topic, I will only focus on the "Female" survey.

More information on the survey methods are available [here](https://www.cdc.gov/nchs/nsfg/about_nsfg.htm). 

Since I am primarily interested on the questions pertaining to contraceptive use, I will reduce each of the large data files to only the questions I am interested in. 

## Loading Necessary Packages

```r
## For folder structure
library(here)
library(ezknitr)

## For data import/cleaning
library(tidyverse)
library(SAScii)
```

## Importing data
While I can download the original data sources to my machine, they appear to be quite large, so I will instead access them directly from the CDC website. These files are in `.dat` format, and have SAS script that describes how to import the data. Luckily, the `SAScii` package exists to combine SAS scripts and `.dat` files and import them into an R environment.  

### 2013 - 2015

```r
data_1315 <- read.SAScii(
  fn = "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/2013_2015_FemRespData.dat",
  sas_ri = "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/sas/2013_2015_FemRespSetup.sas"
)

saveRDS(data_1315, here("raw_data", "data_1315.rds"))
```


```r
data_1315 <- readRDS(here("raw_data", "data_1315.rds"))
```


According to the metadata, this file is arranged so that each respondents' answers are arranged in a single column, with the question asked in each row. This is otherwise known as "wide" data. Once the data has been imported, it can be reduced to include only the columns of interest. The codebook for responses can be found [here](https://www.cdc.gov/nchs/data/nsfg/NSFG_2013-2015_UG_App1a_FemRespFile_Index.pdf). 

Here are the ones I'll be keeping: 
* **CASEID**: Respondent ID Number
* **AGE_R**: Respondent's age at interview
* **MARSTAT**: Respondent's marital status
* **PREGNOWQ**: Whether respondent is currently pregnant
* **RHADSEX**: Whether respondent has ever had sex (heterosexual vaginal intercourse)
* **SEDBC**: Formal Sex Ed Before 18: Methods of Birth Control
* **SEDSTD**: Formal Sex Ed Before 18: STD
* **SEDABST**: Formal Sex Ed Before 18: Waiting Until Marriage
* **LIFEPRTS**: Number of Male Sexual Partners in Lifetime
* **HYST**: Respondent is surgically sterile at interview due to hysterectomy
* **OVAREM**: Respondent is surgically sterile at interview due to ovary removal
* **OTHR**: Respondent is surgically sterile at interview due to other female operation
* **VASECT**: Respondent's husband/partner is currently sterile from vasectomy
* **POSIBLPG**: Physically possible for Respondent to have a baby
* **POSIBLMN**: Physically possible for Respondents current husband/partner to father a baby
* **PILL**: EA-1 Respondent ever used birth contorl pills? 
* **CONDOM**: EA-2 Respondent ever used condoms? 
* **VASECTMY**: EA-3 Respondent ever used partner's vasectomy? 
* **DEPOPROV**: EA-4 Respondent ever used Depo-Provera, injectables?
* **WIDRAWAL**: EA-5 Respondent ever used withdrawal?
* **RHYTHM**: EA-7 Respondent ever used calendar rhythm method? 
* **SDAYCBDS**: EA-7b Respondent ever used Standard Days or CycleBeads method? 
* **TEMPSAFE**: EA-8 Respondent ever used symptothermal method? 
* **PATCH**: EA-9 Respondent ever used contraceptive patch? 
* **RING**: EA-10 Respondent ever used vaginal contraceptive ring or "NuvaRing"?
* **MORNPILL**: EA-11 Respondent ever used emergency contraception? 
* **ECTIMESX**: EA-12 Number of times Respondent used emergency contraception
* **EVERUSED**: Respondent ever used any type of contraception? (computed)
* **EVIUDTYP1**: EA-15a Types of IUD ever used - 1st mention
* **EVIUDTYP2**: EA-15a Types of IUD ever used - 2nd mention
* **METHSTOP01 - METHSTOP10**: EA-17 Method stopped using due to dissatisfaction - 1st through 10th method
* **STOPPILL1 - STOPPILL6**: Computed open-ended response to reason(s) for discontinuation of the pill - 1st through 6th mention
* **STOPCOND1 - STOPCOND2**: Computed open-ended response to reason(s) for discontinuation of the condom - 1st and 2nd mention
* **STOPDEPO1 - STOPDEPO2**: Computed open-ended response to reason(s) for discontinuation of Depo Provera - 1st and 2nd mention
* **TYPEIUD_1 - TYPEIUD_2**: Type of IUD that was continued due to dissatisfaction - 1st and 2nd mention
* **STOPIUD1 - STOPIUD5**: Computed open-ended response to reason(s) for discontinuation of IUD - 1st through 5th mention
* **WHYNOUSING1 - WHYNOUSING5**: Reason not using birth control (at risk of unintended pregnancy) - 1st through 5th mention
* **YUSEPILL1 - YUSEPILL7**: Reasons for recent pill use - 1st through 7th mention
* **JINTEND**: Respondent and husband/partner intend to have a/another baby some time? 
* **JSUREINT**: How sure respondent and husband/partner will/will not have another baby? 
* **INTEND**: Respondent intends to have a/another baby some time? 
* **SUREINT**: How sure Respondent will/will not have a/another baby? 
* **REACTSLF**: How respondent would feel if she got pregnant now
* **LESSPLSR**: Chance respondent would feel less physical pleasure if partner used a condom
* **EMBARRAS**: Chance condom discussion would embarrass respondent & partner
* **ORIENT**: Respondent's sexual orientation
* **CONFCONC**: Not go for sexual or reproductive health care because your parents might find out
* **BTHCON12**: Recieved method birth control/prescription in the last 12 months
* **MEDTST12**: Received checkup for birth control last 12 months
* **BC12PAYX7 - BC12PAYX9**: Way bill was paid - method birth control/prescription - 1st through 4th methods
* **BC12PAYX10 - BC12PAYX16**: Way bill was paid - check up for birth control - 1st through 4th methods
* **BC12PAYX19 - BC12PAYX22**: Way bill was paid - counseling about birth control - 1st through 4th methods


## Cleaning Data

I'll create a character vector of all of the column names that don't have repeats so that I can trim to just the columns that I need. Any of the column names that have numeric repeats (e.g., `METHSTOP01`, `METHSTOP02`) can be specified using the `num_range()` function inside of `select()` from `dplyr`.

```r
general_ques <- c("CASEID", "AGE_R", "MARSTAT", "PREGNOWQ", "RHADSEX", "SEDBC", "SEDSTD", "SEDABST", "LIFEPRTS", "HYST", "OVAREM", "OTHR", "VASECT", "POSIBLPG", "POSIBLMN", "PILL", "CONDOM", "VASECTMY", "DEPOPROV", "WIDRAWAL", "RHYTHM", "SDAYCBDS", "TEMPSAFE", "PATCH", "RING", "MORNPILL", "ECTIMESX", "EVERUSED", "JINTEND", "JSUREINT", "INTEND", "JSUREINT", "INTEND", "SUREINT", "REACTSLF", "LESSPLSR", "EMBARRAS", "ORIENT", "CONFCONC", "BTHCON12", "MEDTST12")
```


```r
general_data_1315 <- data_1315 %>% 
  select(one_of(general_ques), 
         num_range("EVIUDTYP", 1:2), 
         num_range("METHSTOP", 1:10), 
         num_range("STOPPILL", 1:6), 
         num_range("STOPCOND", 1:2), 
         num_range("STOPDEPO", 1:2),
         num_range("TYPEIUD_", 1:2),
         num_range("STOPIUD", 1:5),
         num_range("WHYNOUSING", 1:5),
         num_range("YUSEPILL", 1:7),
         num_range("BC12PAYX", 7:22)
  )

saveRDS(general_data_1315, here("processed_data", "general_data_1315.rds"))
```


```r
general_data_1315 <- readRDS(here("processed_data", "general_data_1315.rds"))
```


---

I also want a secondary data frame that just looks at the methods used monthly over the course of four years. 

These are all labeled as **METHX1** through **METHX192**. 

This one doesn't need a character vector. 


## Exploring Data


```r
str(general_data_1315)
```

```
## 'data.frame':	5699 obs. of  83 variables:
##  $ CASEID     : num  60418 60419 60420 60423 60426 ...
##  $ AGE_R      : num  38 37 33 31 39 19 31 16 24 29 ...
##  $ MARSTAT    : num  2 2 6 6 1 6 5 6 5 1 ...
##  $ PREGNOWQ   : num  5 1 5 5 5 5 5 5 5 5 ...
##  $ RHADSEX    : num  1 1 1 1 1 5 1 5 1 1 ...
##  $ SEDBC      : num  NA NA NA NA NA 1 NA 1 1 NA ...
##  $ SEDSTD     : num  NA NA NA NA NA 1 NA 1 1 NA ...
##  $ SEDABST    : num  NA NA NA NA NA 1 NA 5 1 NA ...
##  $ LIFEPRTS   : num  30 5 12 8 8 0 6 0 1 1 ...
##  $ HYST       : num  5 5 5 5 5 5 5 5 5 5 ...
##  $ OVAREM     : num  5 5 5 5 5 5 5 5 5 5 ...
##  $ OTHR       : num  5 5 5 5 5 5 5 5 5 5 ...
##  $ VASECT     : num  5 5 NA NA 5 NA NA NA NA 5 ...
##  $ POSIBLPG   : num  NA NA 1 NA 1 1 1 1 1 1 ...
##  $ POSIBLMN   : num  NA NA NA NA 1 NA NA NA NA 1 ...
##  $ PILL       : num  1 1 1 1 1 1 1 5 1 1 ...
##  $ CONDOM     : num  1 1 1 1 1 NA 1 NA 1 1 ...
##  $ VASECTMY   : num  1 5 5 5 5 NA 5 NA 5 5 ...
##  $ DEPOPROV   : num  1 5 5 1 5 5 1 5 5 5 ...
##  $ WIDRAWAL   : num  1 5 1 1 5 NA 1 NA 1 1 ...
##  $ RHYTHM     : num  5 5 5 5 5 NA 5 NA 5 5 ...
##  $ SDAYCBDS   : num  5 5 5 5 5 NA 5 NA 5 5 ...
##  $ TEMPSAFE   : num  5 5 5 5 5 NA 5 NA 5 5 ...
##  $ PATCH      : num  5 5 5 5 5 1 5 5 5 1 ...
##  $ RING       : num  5 5 5 5 5 5 5 5 5 5 ...
##  $ MORNPILL   : num  5 5 1 5 5 NA 5 NA 5 1 ...
##  $ ECTIMESX   : num  NA NA 2 NA NA NA NA NA NA 3 ...
##  $ EVERUSED   : num  1 1 1 1 1 1 1 5 1 1 ...
##  $ JINTEND    : num  NA 5 NA NA 5 NA NA NA NA 5 ...
##  $ JSUREINT   : num  NA 2 NA NA 1 NA NA NA NA 2 ...
##  $ INTEND     : num  NA NA 1 NA NA 1 1 1 1 NA ...
##  $ SUREINT    : num  NA NA 1 NA NA 3 2 1 1 NA ...
##  $ REACTSLF   : num  NA NA 2 NA 3 1 3 2 4 3 ...
##  $ LESSPLSR   : num  NA NA NA NA NA 1 NA 3 3 NA ...
##  $ EMBARRAS   : num  NA NA NA NA NA 4 NA 2 5 NA ...
##  $ ORIENT     : num  3 1 1 1 1 1 3 1 1 1 ...
##  $ CONFCONC   : num  NA NA NA NA NA 5 NA 5 NA NA ...
##  $ BTHCON12   : num  5 5 1 5 5 1 5 5 1 5 ...
##  $ MEDTST12   : num  5 5 1 5 5 1 5 5 1 5 ...
##  $ EVIUDTYP1  : num  1 NA NA NA NA NA NA NA NA NA ...
##  $ EVIUDTYP2  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ METHSTOP10 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPPILL1  : num  NA NA NA 4 NA NA NA NA NA 1 ...
##  $ STOPPILL2  : num  NA NA NA NA NA NA NA NA NA 4 ...
##  $ STOPPILL3  : num  NA NA NA NA NA NA NA NA NA 17 ...
##  $ STOPPILL4  : num  NA NA NA NA NA NA NA NA NA 21 ...
##  $ STOPPILL5  : num  NA NA NA NA NA NA NA NA NA 23 ...
##  $ STOPPILL6  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPCOND1  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPCOND2  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPDEPO1  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPDEPO2  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ TYPEIUD_1  : num  1 NA NA NA NA NA NA NA NA NA ...
##  $ TYPEIUD_2  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPIUD1   : num  2 NA NA NA NA NA NA NA NA NA ...
##  $ STOPIUD2   : num  7 NA NA NA NA NA NA NA NA NA ...
##  $ STOPIUD3   : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPIUD4   : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ STOPIUD5   : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ WHYNOUSING1: num  NA NA NA NA NA NA NA NA NA NA ...
##  $ WHYNOUSING2: num  NA NA NA NA NA NA NA NA NA NA ...
##  $ WHYNOUSING3: num  NA NA NA NA NA NA NA NA NA NA ...
##  $ WHYNOUSING4: num  NA NA NA NA NA NA NA NA NA NA ...
##  $ WHYNOUSING5: num  NA NA NA NA NA NA NA NA NA NA ...
##  $ YUSEPILL1  : num  NA NA 1 NA NA 2 NA NA NA NA ...
##  $ YUSEPILL2  : num  NA NA 2 NA NA 6 NA NA NA NA ...
##  $ YUSEPILL3  : num  NA NA 6 NA NA 7 NA NA NA NA ...
##  $ YUSEPILL4  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ YUSEPILL5  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ YUSEPILL6  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ YUSEPILL7  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX7  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX8  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX9  : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX10 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX13 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX14 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX15 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX16 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX19 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX20 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX21 : num  NA NA NA NA NA NA NA NA NA NA ...
##  $ BC12PAYX22 : num  NA NA NA NA NA NA NA NA NA NA ...
```


```r
summary(general_data_1315)
```

```
##      CASEID          AGE_R          MARSTAT        PREGNOWQ    
##  Min.   :60418   Min.   :15.00   Min.   :1.00   Min.   :1.000  
##  1st Qu.:62952   1st Qu.:22.00   1st Qu.:1.00   1st Qu.:5.000  
##  Median :65492   Median :29.00   Median :5.00   Median :5.000  
##  Mean   :65522   Mean   :28.88   Mean   :3.79   Mean   :4.837  
##  3rd Qu.:68104   3rd Qu.:36.00   3rd Qu.:6.00   3rd Qu.:5.000  
##  Max.   :70620   Max.   :45.00   Max.   :9.00   Max.   :9.000  
##                                                 NA's   :7      
##     RHADSEX         SEDBC           SEDSTD         SEDABST     
##  Min.   :1.00   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.:1.00   1st Qu.:1.000   1st Qu.:1.000   1st Qu.:1.000  
##  Median :1.00   Median :1.000   Median :1.000   Median :1.000  
##  Mean   :1.57   Mean   :2.116   Mean   :1.298   Mean   :2.333  
##  3rd Qu.:1.00   3rd Qu.:5.000   3rd Qu.:1.000   3rd Qu.:5.000  
##  Max.   :5.00   Max.   :9.000   Max.   :9.000   Max.   :9.000  
##                 NA's   :3728    NA's   :3728    NA's   :3728   
##     LIFEPRTS           HYST           OVAREM           OTHR      
##  Min.   : 0.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.: 1.000   1st Qu.:5.000   1st Qu.:5.000   1st Qu.:5.000  
##  Median : 4.000   Median :5.000   Median :5.000   Median :5.000  
##  Mean   : 6.794   Mean   :4.885   Mean   :4.961   Mean   :4.962  
##  3rd Qu.: 7.000   3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.:5.000  
##  Max.   :99.000   Max.   :5.000   Max.   :5.000   Max.   :5.000  
##                                                                  
##      VASECT         POSIBLPG        POSIBLMN          PILL      
##  Min.   :1.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.:5.000   1st Qu.:1.000   1st Qu.:1.000   1st Qu.:1.000  
##  Median :5.000   Median :1.000   Median :1.000   Median :1.000  
##  Mean   :4.715   Mean   :1.197   Mean   :1.113   Mean   :2.284  
##  3rd Qu.:5.000   3rd Qu.:1.000   3rd Qu.:1.000   3rd Qu.:5.000  
##  Max.   :5.000   Max.   :9.000   Max.   :9.000   Max.   :8.000  
##  NA's   :3190    NA's   :1051    NA's   :4007                   
##      CONDOM         VASECTMY        DEPOPROV        WIDRAWAL    
##  Min.   :1.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.:1.000   1st Qu.:5.000   1st Qu.:5.000   1st Qu.:1.000  
##  Median :1.000   Median :5.000   Median :5.000   Median :1.000  
##  Mean   :1.229   Mean   :4.637   Mean   :4.026   Mean   :2.414  
##  3rd Qu.:1.000   3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.:5.000  
##  Max.   :5.000   Max.   :9.000   Max.   :9.000   Max.   :9.000  
##  NA's   :812     NA's   :812                     NA's   :812    
##      RHYTHM         SDAYCBDS        TEMPSAFE         PATCH      
##  Min.   :1.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.:5.000   1st Qu.:5.000   1st Qu.:5.000   1st Qu.:5.000  
##  Median :5.000   Median :5.000   Median :5.000   Median :5.000  
##  Mean   :4.425   Mean   :4.868   Mean   :4.883   Mean   :4.623  
##  3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.:5.000  
##  Max.   :5.000   Max.   :9.000   Max.   :5.000   Max.   :9.000  
##  NA's   :812     NA's   :812     NA's   :812                    
##       RING          MORNPILL        ECTIMESX        EVERUSED    
##  Min.   :1.000   Min.   :1.000   Min.   : 1.00   Min.   :1.000  
##  1st Qu.:5.000   1st Qu.:5.000   1st Qu.: 1.00   1st Qu.:1.000  
##  Median :5.000   Median :5.000   Median : 1.00   Median :1.000  
##  Mean   :4.624   Mean   :4.113   Mean   : 2.16   Mean   :1.488  
##  3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.: 2.00   3rd Qu.:1.000  
##  Max.   :9.000   Max.   :9.000   Max.   :99.00   Max.   :7.000  
##                  NA's   :812     NA's   :4613                   
##     JINTEND         JSUREINT         INTEND        SUREINT     
##  Min.   :1.000   Min.   :1.000   Min.   :1.00   Min.   :1.000  
##  1st Qu.:1.000   1st Qu.:1.000   1st Qu.:1.00   1st Qu.:1.000  
##  Median :1.000   Median :1.000   Median :1.00   Median :1.000  
##  Mean   :2.994   Mean   :1.518   Mean   :1.34   Mean   :1.588  
##  3rd Qu.:5.000   3rd Qu.:2.000   3rd Qu.:1.00   3rd Qu.:2.000  
##  Max.   :9.000   Max.   :9.000   Max.   :9.00   Max.   :9.000  
##  NA's   :3916    NA's   :3978    NA's   :3560   NA's   :3582   
##     REACTSLF        LESSPLSR        EMBARRAS         ORIENT     
##  Min.   :1.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.:1.000   1st Qu.:1.000   1st Qu.:1.000   1st Qu.:1.000  
##  Median :2.000   Median :2.000   Median :1.000   Median :1.000  
##  Mean   :2.361   Mean   :2.743   Mean   :1.868   Mean   :1.242  
##  3rd Qu.:3.000   3rd Qu.:3.000   3rd Qu.:2.000   3rd Qu.:1.000  
##  Max.   :9.000   Max.   :9.000   Max.   :9.000   Max.   :9.000  
##  NA's   :1346    NA's   :3728    NA's   :3728                   
##     CONFCONC        BTHCON12        MEDTST12       EVIUDTYP1    
##  Min.   :1.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.:5.000   1st Qu.:1.000   1st Qu.:1.000   1st Qu.:1.000  
##  Median :5.000   Median :5.000   Median :5.000   Median :2.000  
##  Mean   :4.456   Mean   :3.716   Mean   :3.969   Mean   :1.796  
##  3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.:5.000   3rd Qu.:2.000  
##  Max.   :9.000   Max.   :8.000   Max.   :9.000   Max.   :9.000  
##  NA's   :4502                                    NA's   :4935   
##    EVIUDTYP2       METHSTOP10     STOPPILL1        STOPPILL2     
##  Min.   :1.000   Min.   : NA    Min.   : 1.000   Min.   : 1.000  
##  1st Qu.:2.000   1st Qu.: NA    1st Qu.: 3.000   1st Qu.: 5.000  
##  Median :2.000   Median : NA    Median : 4.000   Median : 8.000  
##  Mean   :1.912   Mean   :NaN    Mean   : 6.387   Mean   : 9.674  
##  3rd Qu.:2.000   3rd Qu.: NA    3rd Qu.: 8.000   3rd Qu.:14.500  
##  Max.   :2.000   Max.   : NA    Max.   :97.000   Max.   :23.000  
##  NA's   :5665    NA's   :5699   NA's   :4617     NA's   :5340    
##    STOPPILL3       STOPPILL4       STOPPILL5      STOPPILL6   
##  Min.   : 2.00   Min.   : 8.00   Min.   :10.0   Min.   :22    
##  1st Qu.: 8.00   1st Qu.:15.00   1st Qu.:17.0   1st Qu.:22    
##  Median : 9.00   Median :17.00   Median :18.0   Median :22    
##  Mean   :11.88   Mean   :16.89   Mean   :18.2   Mean   :22    
##  3rd Qu.:17.25   3rd Qu.:21.00   3rd Qu.:23.0   3rd Qu.:22    
##  Max.   :23.00   Max.   :23.00   Max.   :23.0   Max.   :22    
##  NA's   :5591    NA's   :5681    NA's   :5694   NA's   :5698  
##    STOPCOND1        STOPCOND2       STOPDEPO1       STOPDEPO2     
##  Min.   : 1.000   Min.   :3.000   Min.   : 1.00   Min.   : 2.000  
##  1st Qu.: 1.250   1st Qu.:7.000   1st Qu.: 1.00   1st Qu.: 2.000  
##  Median : 3.000   Median :9.000   Median : 1.00   Median : 4.500  
##  Mean   : 4.946   Mean   :7.571   Mean   : 3.25   Mean   : 4.844  
##  3rd Qu.: 4.750   3rd Qu.:9.000   3rd Qu.: 4.00   3rd Qu.: 5.250  
##  Max.   :97.000   Max.   :9.000   Max.   :16.00   Max.   :15.000  
##  NA's   :5569     NA's   :5692    NA's   :5615    NA's   :5667    
##    TYPEIUD_1       TYPEIUD_2       STOPIUD1         STOPIUD2     
##  Min.   :1.000   Min.   :2      Min.   : 1.000   Min.   : 2.000  
##  1st Qu.:1.000   1st Qu.:2      1st Qu.: 2.000   1st Qu.: 6.000  
##  Median :2.000   Median :2      Median : 7.000   Median : 7.000  
##  Mean   :1.788   Mean   :2      Mean   : 6.156   Mean   : 7.621  
##  3rd Qu.:2.000   3rd Qu.:2      3rd Qu.:11.000   3rd Qu.:11.000  
##  Max.   :9.000   Max.   :2      Max.   :13.000   Max.   :13.000  
##  NA's   :5468    NA's   :5688   NA's   :5513     NA's   :5633    
##     STOPIUD3        STOPIUD4       STOPIUD5     WHYNOUSING1    
##  Min.   : 5.00   Min.   :12     Min.   : NA    Min.   : 1.000  
##  1st Qu.: 7.25   1st Qu.:12     1st Qu.: NA    1st Qu.: 2.000  
##  Median :12.00   Median :12     Median : NA    Median : 3.000  
##  Mean   :10.27   Mean   :12     Mean   :NaN    Mean   : 6.976  
##  3rd Qu.:12.00   3rd Qu.:12     3rd Qu.: NA    3rd Qu.: 4.000  
##  Max.   :13.00   Max.   :12     Max.   : NA    Max.   :99.000  
##  NA's   :5677    NA's   :5697   NA's   :5699   NA's   :5410    
##   WHYNOUSING2     WHYNOUSING3     WHYNOUSING4    WHYNOUSING5  
##  Min.   :1.000   Min.   :1.000   Min.   :3.00   Min.   :7     
##  1st Qu.:3.000   1st Qu.:4.000   1st Qu.:3.25   1st Qu.:7     
##  Median :4.000   Median :5.000   Median :3.50   Median :7     
##  Mean   :4.472   Mean   :5.231   Mean   :3.50   Mean   :7     
##  3rd Qu.:5.000   3rd Qu.:8.000   3rd Qu.:3.75   3rd Qu.:7     
##  Max.   :9.000   Max.   :9.000   Max.   :4.00   Max.   :7     
##  NA's   :5646    NA's   :5686    NA's   :5697   NA's   :5698  
##    YUSEPILL1        YUSEPILL2       YUSEPILL3       YUSEPILL4    
##  Min.   : 1.000   Min.   :1.000   Min.   :1.000   Min.   :1.000  
##  1st Qu.: 1.000   1st Qu.:2.000   1st Qu.:3.000   1st Qu.:6.000  
##  Median : 1.000   Median :4.000   Median :6.000   Median :6.000  
##  Mean   : 1.959   Mean   :4.099   Mean   :5.276   Mean   :5.857  
##  3rd Qu.: 2.000   3rd Qu.:6.000   3rd Qu.:7.000   3rd Qu.:7.000  
##  Max.   :98.000   Max.   :8.000   Max.   :7.000   Max.   :8.000  
##  NA's   :4815     NA's   :5202    NA's   :5420    NA's   :5594   
##    YUSEPILL5       YUSEPILL6       YUSEPILL7      BC12PAYX7    
##  Min.   :1.000   Min.   :6.000   Min.   :7      Min.   :1.000  
##  1st Qu.:7.000   1st Qu.:7.000   1st Qu.:7      1st Qu.:1.000  
##  Median :7.000   Median :8.000   Median :7      Median :1.000  
##  Mean   :6.353   Mean   :7.333   Mean   :7      Mean   :2.371  
##  3rd Qu.:7.000   3rd Qu.:8.000   3rd Qu.:7      3rd Qu.:4.000  
##  Max.   :8.000   Max.   :8.000   Max.   :7      Max.   :9.000  
##  NA's   :5665    NA's   :5696    NA's   :5698   NA's   :4888   
##    BC12PAYX8       BC12PAYX9       BC12PAYX10     BC12PAYX13  
##  Min.   :1.000   Min.   :3.000   Min.   : NA    Min.   :1.00  
##  1st Qu.:2.000   1st Qu.:3.000   1st Qu.: NA    1st Qu.:1.00  
##  Median :2.000   Median :3.000   Median : NA    Median :1.00  
##  Mean   :2.379   Mean   :3.652   Mean   :NaN    Mean   :2.34  
##  3rd Qu.:2.000   3rd Qu.:4.000   3rd Qu.: NA    3rd Qu.:4.00  
##  Max.   :6.000   Max.   :6.000   Max.   : NA    Max.   :6.00  
##  NA's   :5446    NA's   :5676    NA's   :5699   NA's   :5116  
##    BC12PAYX14      BC12PAYX15      BC12PAYX16     BC12PAYX19   
##  Min.   :1.000   Min.   :3.000   Min.   : NA    Min.   :1.000  
##  1st Qu.:2.000   1st Qu.:3.000   1st Qu.: NA    1st Qu.:1.000  
##  Median :2.000   Median :3.000   Median : NA    Median :2.000  
##  Mean   :2.327   Mean   :3.786   Mean   :NaN    Mean   :2.624  
##  3rd Qu.:2.000   3rd Qu.:4.000   3rd Qu.: NA    3rd Qu.:4.000  
##  Max.   :6.000   Max.   :6.000   Max.   : NA    Max.   :9.000  
##  NA's   :5494    NA's   :5685    NA's   :5699   NA's   :5143   
##    BC12PAYX20      BC12PAYX21      BC12PAYX22  
##  Min.   :1.000   Min.   :3.000   Min.   : NA   
##  1st Qu.:2.000   1st Qu.:3.000   1st Qu.: NA   
##  Median :2.000   Median :3.000   Median : NA   
##  Mean   :2.282   Mean   :3.625   Mean   :NaN   
##  3rd Qu.:2.000   3rd Qu.:4.000   3rd Qu.: NA   
##  Max.   :6.000   Max.   :6.000   Max.   : NA   
##  NA's   :5543    NA's   :5691    NA's   :5699
```








