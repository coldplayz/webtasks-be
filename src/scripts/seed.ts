import { Types, Model, Document } from "mongoose";

import UserModel from "../data-access/models/user.model";
import TaskModel from "../data-access/models/task.model";
import connectDB from "../data-access/connection";
import {
  ITaskCreateDTO,
  ITaskDoc,
  IUserCreateDTO,
  IUserDoc,
  TaskDoc,
  UserDoc,
} from "../entities/interfaces";
// import bc from "bcryptjs";

// arrays for collecting seeded documents
const seededTasks: Types.ObjectId[] = [];
const seededUsers: Types.ObjectId[] = [];

const userData: IUserCreateDTO[] = [
  {
    firstName: 'Greenbel',
    lastName: 'Eleghasim',
    email: 'obisann@gmail.com',
    password: 'greenbelpwd',
  },
  {
    firstName: 'David',
    lastName: 'Eleghasim',
    email: 'david@gmail.com',
    password: 'davidpwd',
  },
];

const taskDataNoOwner: ITaskCreateDTO[] = [
  {
    description: 'Check emails',
    userId: '', // ! add userId prop before saving
  },
  {
    description: 'Do laundry',
    userId: '', // ! add userId prop before saving
  },
  {
    description: 'Cook beans',
    userId: '', // ! add userId prop before saving
  },
];

const db = 'webtasks';

/**
 * Handles the logic for seeding a couple of related collections.
 * 
 * At the moment, there are three collections whose seeding is being handled here:
 *  - users
 *  - tasks
 * 
 * The high-level view of the algorithm is as follows:
 *  - establish database connection
 *  - prepare seed documents, using logic to account for the relationships
 *  - use the `seed` function to seed each collection
 */
async function seeder() {
  // connect to db
  // await mongoose.connect(mongoURI);
  await connectDB(db);

  // seed users
  await seed(UserModel, { docs: userData, isModelled: false }, seededUsers);

  const taskData: ITaskCreateDTO[] = taskDataNoOwner.map((taskObj) => {
    // return tasks with [gb] user id attached, before saving
    return {
      ...taskObj,
      userId: seededUsers[0].toString(),
    };
  });

  await seed(TaskModel, { docs: taskData, isModelled: false }, seededTasks);
}

type SeedDoc = {
  docs: ITaskCreateDTO[] | IUserCreateDTO[] | Document[];
  isModelled: boolean;
};

// TODO: put `seed` function in utils, maybe?

/**
 * Handles seeding an individual collection.
 * @params {mongoose.Model} Model - mongoose model representing the collection to seed.
 * @params {Object[]} docs - documents to seed the database with.
 * @params {Object[]} seedCollector - the array to push seeded docs into.
 */
async function seed(
  Model: (typeof UserModel | typeof TaskModel) & { deleteMany(arg0: any): any },
  docsData: SeedDoc,
  seedCollector: Types.ObjectId[]
) {
  // drop old data
  await Model.deleteMany({});

  // array of docs to be saved
  const toSave: Document[] = [];

  const isDocument = function (obj: unknown): obj is Document {
    return docsData.isModelled;
  };

  const docs = docsData.docs;
  if (!isDocument(docs[0])) {
    for (const doc of docs) {
      // create and save new document
      const newDoc = new Model(doc);
      toSave.push(newDoc);
    }
  } else {
    // docs are already modelled by calling `new Model(doc)`
    toSave.push(...docs as Document[]);
  }

  // execute save op and return seeded docs to collector
  console.log(`seeding ${Model.modelName}...`);
  const bulkResult = await Model.bulkSave(toSave);
  seedCollector.push(...(Object.values(bulkResult.insertedIds)));
  console.log(`seeded ${Model.modelName}\n`);
}

seeder()
  .then(() => {
    console.log('seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
