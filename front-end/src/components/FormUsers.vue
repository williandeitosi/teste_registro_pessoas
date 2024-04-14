<template>
  <div>
    <div class="register">
      <button @click="openModal" class="btn btn-primary">Registrar</button>
    </div>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <div class="container shadow-lg p-3 bg-white">
          <h2 class="text-center">Formulário de Cadastro</h2>
          <form @submit.prevent="submitForm">
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
  data() {
    return {
      isModalOpen: false,
      useCEP: true,
      enderecoDisabled: true,
      endereco: "",
      cep: "",
      bairro: "",
      estado: "",
      cidade: "",
      formData: {
        name: "",
        gender: "",
        dateOfBirth: "",
        maritalStatus: "",
      },
      tableData: [],
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async checkCEP() {
      if (this.cep.length === 8) {
        try {
          const response = await axios.get(
            `https://viacep.com.br/ws/${this.cep}/json/`
          );
          const { data } = response;
          if (!data.erro) {
            this.endereco = data.logradouro;
            this.bairro = data.bairro;
            this.estado = data.uf;
            this.cidade = data.localidade;
          } else {
            this.endereco = "";
            this.bairro = "";
            this.estado = "";
            this.cidade = "";

            console.error("CEP não encontrado");
          }
        } catch (error) {
          console.error("ERRO ao buscar o CEP: ", error);
        }
      }
    },
    handleCEPToggle() {
      this.enderecoDisabled = this.useCEP;
    },

    async submitForm() {
      console.log("Método submitForm chamado");
      try {
        const formData = {
          name: this.name,
          gender: this.gender,
          dateOfBirth: this.dateOfBirth,
          maritalStatus: this.maritalStatus,
        };

        const response = await axios.post(
          "http://localhost:3333/person",
          this.formData
        );

        if (response.status === 201) {
          const newUser = {
            id: response.data.id,
            name: response.data.name,
            gender: response.data.gender,
            dataOfBirth: response.data.dataOfBirth,
            maritalStatus: response.data.maritalStatus,
          };

          const dob = new Date(newUser.dataOfBirth);
          const today = new Date();
          const todayUTC = new Date(
            Date.UTC(
              today.getUTCFullYear(),
              today.getUTCMonth(),
              today.getUTCDate()
            )
          );
          let age = todayUTC.getUTCFullYear() - dob.getUTCFullYear();
          const month = todayUTC.getUTCMonth() - dob.getUTCMonth();
          if (
            month < 0 ||
            (month === 0 && todayUTC.getUTCDate() < dob.getUTCDate())
          ) {
            age--;
          }
          console.log("Idade:", age);

          const nextBirthday = new Date(
            todayUTC.getUTCFullYear() + 1,
            dob.getUTCMonth(),
            dob.getUTCDate()
          );
          const oneDay = 24 * 60 * 60 * 1000;
          const daysUntilNextBirthday = Math.round(
            (nextBirthday - todayUTC) / oneDay
          );
          console.log("Dias até o próximo aniversário:", daysUntilNextBirthday);

          if (
            todayUTC.getUTCMonth() === dob.getUTCMonth() &&
            todayUTC.getUTCDate() === dob.getUTCDate()
          ) {
            alert("Parabéns pelo seu aniversário! 🎉");
          } else {
            alert(
              `Cadastro realizado com sucesso! Sua idade é ${age} anos e faltam ${daysUntilNextBirthday} dias para o seu próximo aniversário.`
            );
          }

          this.$emit("update-table", newUser);
        }

        console.log("Resposta do backend:", response.data);

        this.formData.name = "";
        this.formData.gender = "";
        this.formData.dateOfBirth = "";
        this.formData.maritalStatus = "";
        this.cep = "";
        this.endereco = "";
        this.numero = "";
        this.complemento = "";
        this.bairro = "";
        this.estado = "";
        this.cidade = "";

        this.closeModal();

        location.reload(true);
        this.atualizarTabela();
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
      }
    },
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
