
# Importing Packages

## For folder structure
library(here)

## For data import/cleaning
library(tidyverse)
library(SAScii)
library(purrr)
library(rlang)
library(forcats)
#
# Importing Data Using Provided .sas.txt files

## 2006 - 2010 Data
dataURL_0610 <- "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/2006_2010_FemResp.dat"
codeURL_0610 <- here("raw_data", "2006_2010_FemRespSetup.sas.txt")

data_0610 <- read.SAScii(
  fn = dataURL_0610,
  sas_ri = codeURL_0610
)

## 2011 - 2013 Data
dataURL_1113 <- "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/2011_2013_FemRespData.dat"
codeURL_1113 <- "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/sas/2011_2013_FemRespSetup.sas"

data_1113 <- read.SAScii(
  fn = dataURL_1113,
  sas_ri = codeURL_1113
)

## 2013 - 2015 Data
dataURL_1315 <- "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/2013_2015_FemRespData.dat"
codeURL_1315 <- "ftp://ftp.cdc.gov/pub/Health_Statistics/NCHS/Datasets/NSFG/sas/2013_2015_FemRespSetup.sas"

data_1315 <- read.SAScii(
  fn = dataURL_1315,
  sas_ri = codeURL_1315
)

## Function to clean imported data

cleanData<- function(data, years){

  general_ques <- c("CASEID", "AGE_R", "MARSTAT", "PREGNOWQ", "RHADSEX", "SEDBC", "SEDSTD", "SEDABST", "LIFEPRTS", "HYST", "OVAREM", "OTHR", "VASECT", "POSIBLPG", "POSIBLMN", "PILL", "CONDOM", "VASECTMY", "DEPOPROV", "WIDRAWAL", "RHYTHM", "SDAYCBDS", "TEMPSAFE", "PATCH", "RING", "MORNPILL", "ECTIMESX", "EVERUSED", "JINTEND", "JSUREINT", "INTEND", "JSUREINT", "INTEND", "SUREINT", "REACTSLF", "LESSPLSR", "EMBARRAS", "ORIENT", "CONFCONC", "BTHCON12", "MEDTST12", "WNFSTUSE_Y", "STRLOPER")

  filteredData <- data %>%
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
           num_range("BC12PAYX", 7:22),
           num_range("FIRSMETH", 1:4),
           num_range("REASPILL0", 1:6),
           num_range("REASCOND0", 1:7),
           num_range("REASDEPO0", 1:8),
           num_range("REASIUD0", 1:5),
           num_range("METHX", 1:192),
           num_range("SIMSEQX", 1:48),
           num_range("LSTMTHP", 1:4),
           num_range("CONSTAT", 1:4)
    ) %>%
    mutate(yearRange = years)
}

clean_0610 <- cleanData(data_0610, "0610")
clean_1113 <- cleanData(data_1113, "1113")
clean_1315 <- cleanData(data_1315, "1315")

allData <- bind_rows(clean_0610, clean_1113, clean_1315)

## Save the data as an RDS file as a backup
saveRDS(allData, here("raw_data", "data_0615.rds"))
