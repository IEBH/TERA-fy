TERA-fy Hints
=============
Hints are a single string attached to file uploads to provide some context as to where it fits within the overall process. They are usually past-tense single-words indicating the output from each stage.

When attached to files they indicate that the generated file is an output from a stage. e.g. if a file is noted with the hint 'deduped' it indicates it is the product of a de-duplication stage.

They are used in multiple places:

* Calls to most project library handling functions - `selectProjectLibrary()`, `setProjectLibrary()`
* Within the UI to indicate what library is used during what process


Hint Reference
--------------
The following is a non-definitive list of hints that can be associated with files. In all cases the hint should be a lower-case single, past-tense word. Upper-case indicates a variable.

This list should also be mirrored in the main tera-tools.com/api/tools.json meta-list.


| Hint         | Description                                                                                                                                                  |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `search`     | The product of a search design stage                                                                                                                         |
| `deduped`    | One or more files, that are the product of a deduplication stage                                                                                             |
| `screened-X` | One or more files from the screening stage, generally there will be one file per reviewer where `X` indicates the reviewer number starting with the number 1 |
| `disputed`   | Generally a single file which is the product of a resolved dispute stage which merges in multiple `screened-X` files                                         |
| `snowballed` | A file which has been through the snowballing stage                                                                                                          |
