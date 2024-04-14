<template>
  <div>
    <div class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <div class="container shadow-lg p-3 bg-white">
          <h2 class="text-center">Formulário de Cadastro</h2>
          <form @submit.prevent="editUser">
            <div class="form-group row">
              <div class="col-sm-9">
                <label for="nome">Nome:</label>
                <input
                  type="text"
                  class="form-control"
                  id="nome"
                  placeholder="Informe seu nome"
                  v-model="formData.name"
                  required
                />
              </div>
              <div class="col-sm-3">
                <label for="sexo">Sexo:</label>
                <select
                  class="form-control"
                  id="sexo"
                  v-model="formData.gender"
                  required
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-6">
                <label for="dataNascimento">Data de Nascimento:</label>
                <input
                  type="date"
                  class="form-control"
                  id="dataNascimento"
                  v-model="formData.dataOfBirth"
                  required
                />
              </div>
              <div class="col-6">
                <label for="estadoCivil">Estado Civil:</label>
                <select
                  class="form-control"
                  id="estadoCivil"
                  v-model="formData.maritalStatus"
                  required
                >
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
            </div>

            <div class="d-grid d-md-block mt-4">
              <button class="btn btn-primary w-100" type="submit">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    user_id: Number,
  },
  data() {
    return {
      formData: {
        name: "",
        gender: "",
        dateOfBirth: "",
        maritalStatus: "",
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
      location.reload();
    },

    async editUser() {
      const response = await axios.put(
        `http://localhost:3333/person/${this.user_id}`,
        this.formData
      );

      if (response.status === 200) {
        const newUser = {
          id: response.data.id,
          name: response.data.name,
          gender: response.data.gender,
          dataOfBirth: response.data.dataOfBirth,
          maritalStatus: response.data.maritalStatus,
        };
        this.closeModal();
      }
    },
  },
  mounted() {
    axios
      .get(`http://localhost:3333/person/${this.user_id}`)
      .then((response) => {
        console.log(response.data);
        this.formData = response.data;
        console.log("Dados atualizados:", this.formData);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  },
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15px auto;
  padding: 10px;
  border: 1px solid #888;
  width: 70%;
}

.close {
  display: flex;
  justify-content: flex-end;
  color: #aaaaaa;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
.register {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
