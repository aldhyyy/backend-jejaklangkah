const { dbConnection } = require('../configs/db');

const useDB = `USE ${process.env.DB_NAME}`;
const tableName = 'addresses';

exports.CreateAddress = (body) => {
  const {
    user_id,
    address_name,
    address,
    city,
    province,
    is_default_address,
  } = body;

  return new Promise((resolve, reject) => {
    dbConnection.query(
      `${useDB}; INSERT INTO ${tableName} (
        user_id,
        address_name,
        address,
        city,
        province,
        is_default_address
        ) VALUE(?,?,?,?,?,?);
        `,
      [user_id, address_name, address, city, province, is_default_address],
      (error, result) => {
        if (error) return reject(new Error(error));
        return resolve(result);
      }
    );
  });
};

exports.DeleteAddress = (id, user_id) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `
      ${useDB};
      SELECT * FROM ${tableName} WHERE _id=? AND user_id=?;`,
      [id, user_id],
      (error, result) => {
        if (error || !result[1][0]) {
          return reject(new Error(`Address with id ${id} doesn't exists`));
        }

        dbConnection.query(
          `
            ${useDB};
            DELETE FROM ${tableName} WHERE _id=${id}
        `,
          (error, result) => {
            if (error) {
              return reject(new Error(error));
            }
            return resolve(result);
          }
        );
      }
    );
  });
};

exports.UpdateAddress = (id, user_id, body) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `
      ${useDB};
      SELECT * FROM ${tableName} WHERE _id=? AND user_id=?;`,
      [id, user_id],
      (error, result) => {
        if (error || !result[1][0]) {
          return reject(new Error(`Address with id ${id} doesn't exists`));
        }

        dbConnection.query(
          `
            ${useDB};
            UPDATE ${tableName} SET 
            ${Object.keys(body)
              .map((v) => `${v}='${body[v]}'`)
              .join(',')}
            WHERE _id=${id};
        `,
          (error, result) => {
            if (error) {
              return reject(new Error(error));
            }
            return resolve(result);
          }
        );
      }
    );
  });
};

exports.GetAddresses = (user_id) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `${useDB}; SELECT * FROM ${tableName} WHERE user_id=?;
      `,
      [user_id],
      (error, result) => {
        if (error) return reject(new Error(error));
        return resolve(result);
      }
    );
  });
};

exports.GetAddress = (id, user_id) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `${useDB}; SELECT * FROM ${tableName} WHERE _id=? AND user_id=?;
      `,
      [id, user_id],
      (error, result) => {
        if (error || !result[1][0]) {
          return reject(new Error(`Address with id ${id} doesn't exists`));
        }
        return resolve(result);
      }
    );
  });
};
