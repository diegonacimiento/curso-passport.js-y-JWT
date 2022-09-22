import boom from "@hapi/boom";
import { sequelize } from "../libs/sequelize.js";
const { models }  = sequelize;
import bcrypt from "bcrypt";

class usuariosService {
  constructor() {
  };

  async buscar() {
    const res = await models.User.findAll({
      include: ["cliente"],
    });
		return res;
  };

  // Creamos la función buscarEmail():
  async buscarEmail(Email) {
    // Aplicamos el método findOne():
    const res = await models.User.findOne({
      // Le decimos que nos traiga el usuario que tenga el email:
      // Tener en cuenta: como en la base de datos tenemos escrito "Email"
      // con la e en mayúscula, debemos escribir exactamente igual tanto
      // en el parámetro de buscarEmail() como en el where: {}
      where: { Email },
    });
    return res;
  };

  async buscarId(id) {
    const user = await models.User.findByPk(id);
		if (!user) {
			throw boom.notFound("El usuario no existe");
		};
		return user;
  };

  async crear(body) {
    const hash = await bcrypt.hash(body.Contraseña, 10);
    const user = await models.User.findByPk(body["id"]);
		if (user) {
			throw boom.conflict("El usuario ya existe, seleccione otro user");
		};
    const newUser = await models.User.create({
      ...body,
      Contraseña: hash,
    });
    delete newUser.dataValues.Contraseña;
		return newUser;
  };

  async modificar(id, body) {
    const user = await this.buscarId(id);
		const res = await user.update({
			...user,
			...body,
		});
		return res;
  };

  async eliminar(id) {
    const user = await this.buscarId(id);
		const email = user["Email"];
    await user.destroy();
		return {
      id,
      email,
    };
  };
};

export default usuariosService;
