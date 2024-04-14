<template>
  <div>
    <div class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <tr v-for="address in listAddress">
          <th scope="row">{{ address.cep }}</th>
        </tr>
        <button
          v-if="btnAddAddress"
          class="btn btn-primary"
          @click="addAddress"
        >
          Adicionar Endereço
        </button>
        <div v-if="showFormAddress" class="container shadow-lg p-3 bg-white">
          <form @submit.prevent="submitForm">
            <h3 class="mt-2 text-center">Cadastro de Endereço</h3>
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                id="useCEP"
                v-model="useCEP"
                @change="handleCEPToggle"
              />
              <label class="form-check-label" for="useCEP">
                Usar preenchimento automático de endereço via CEP
              </label>
            </div>
            <div class="form-group row">
              <div class="col-md-3">
                <label for="cep">CEP:</label>
                <input
                  type="text"
                  class="form-control"
                  id="cep"
                  placeholder="CEP"
                  v-model="cep"
                  :disabled="!useCEP"
                  @input="checkCEP"
                />
              </div>
              <div class="col-md-9">
                <label for="endereco">Endereço:</label>
                <input
                  type="text"
                  class="form-control"
                  id="endereco"
                  placeholder="Informe o endereço"
                  v-model="endereco"
                  :disabled="enderecoDisabled"
                />
              </div>
            </div>
            <div class="form-group row">
              <div class="col-2">
                <label for="numero">Número:</label>
                <input
                  type="text"
                  class="form-control"
                  id="numero"
                  v-model="numero"
                  placeholder="número"
                />
              </div>
              <div class="col-10">
                <label for="complemento">Complemento:</label>
                <input
                  type="text"
                  class="form-control"
                  id="complemento"
                  placeholder="Informe o complemento (não é obrigatório)"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="bairro">Bairro:</label>
              <input
                type="text"
                class="form-control"
                id="bairro"
                placeholder="Informe o bairro"
                v-model="bairro"
                :disabled="enderecoDisabled"
              />
            </div>
            <div class="form-group row">
              <div class="col-6">
                <label for="estado">Estado:</label>
                <input
                  type="text"
                  class="form-control"
                  id="estado"
                  placeholder="Informe o estado"
                  v-model="estado"
                  :disabled="enderecoDisabled"
                />
              </div>
              <div class="col-6">
                <label for="cidade">Cidade:</label>
                <input
                  type="text"
                  class="form-control"
                  id="cidade"
                  placeholder="Informe a cidade"
                  v-model="cidade"
                  :disabled="enderecoDisabled"
                />
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
      showFormAddress: false,
      useCEP: true,
      enderecoDisabled: true,
      btnAddAddress: true,
      cep: "",
      endereco: "",
      bairro: "",
      estado: "",
      cidade: "",
      addressData: {
        cep: String,
        endereco: String,
        bairro: String,
        estado: String,
        cidade: String,
      },
      listAddress: [],
    };
  },
  methods: {
    addAddress() {
      this.showFormAddress = true;
      this.btnAddAddress = false;
    },
    handleCEPToggle() {
      this.enderecoDisabled = this.useCEP;
    },
    closeModal() {
      location.reload();
    },

    async editUser() {
      const response = await axios.put(
        `http://localhost:3333/address/${this.user_id}`,
        this.formData
      );

      if (response.status === 200) {
        const newUser = {
          cep: response.data.cep,
          endereco: response.data.endereco,
          bairro: response.data.bairro,
          estado: response.data.estado,
          cidade: response.data.cidade,
        };
        this.closeModal();
      }
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
    async submitForm() {
      console.log("Método submitForm chamado");
      try {
        const addressData = {
          cep: this.cep,
          address: this.endereco,
          neighborhood: this.bairro,
          state: this.estado,
          city: this.cidade,
          number: this.numero,
        };

        const response = await axios.post(
          "http://localhost:3333/address",
          addressData
        );

        if (response.status === 201) {
          const newUser = {
            cep: response.data.cep,
            endereco: response.data.endereco,
            bairro: response.data.bairro,
            estado: response.data.estado,
            cidade: response.data.cidade,
          };
        }

        console.log("Resposta do backend:", response.data);

        this.cep = "";
        this.endereco = "";
        this.bairro = "";
        this.estado = "";
        this.cidade = "";

        this.closeModal();
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
      }
    },
  },
  mounted() {
    axios
      .get(`http://localhost:3333/person/${this.user_id}/address`)
      .then((response) => {
        console.log(response.data);
        this.listAddress = response.data;
        console.log("Dados atualizados:", this.listAddress);
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
