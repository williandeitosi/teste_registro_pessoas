<template>
  <div class="container">
    <h2 class="text-center mb-3">Lista</h2>
    <table v-if="users.length > 0" class="table table-striped">
      <thead class="table-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Sexo</th>
          <th scope="col">Data de Nascimento</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody class="table-secondary">
        <tr v-for="user in users">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.gender }}</td>
          <td>{{ user.dataOfBirth }}</td>
          <td>
            <div class="d-flex gap-1">
              <button
                class="btn btn-warning hover-zoom"
                @click="editModal(user)"
              >
                Editar
              </button>
              <button
                class="btn btn-secondary hover-zoom"
                @click="datailModal(user)"
              >
                Ver
              </button>
              <button
                class="btn btn-primary hover-zoom"
                @click="addressModal(user)"
              >
                Endereços
              </button>
              <button class="btn btn-danger" @click="deleteUser(user.id)">
                X
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- edit form -->
    <ModalDatail
      v-if="showDetailModal"
      :user_id="selectUser.id"
      @close-modal="closeDetailModal"
    />
    <ModalEdit
      v-if="showEditModal"
      :user_id="selectUser.id"
      @close-modal="closeEditModal"
    />
    <AddressListModal
      v-if="showAddressModal"
      :user_id="selectUser.id"
      @close-modal="closeAddressModal"
    />
  </div>
</template>

<script>
import axios from "axios"; // Import Axios for HTTP requests
import ModalDatail from "./ModalDatail.vue";
import ModalEdit from "./ModalEdit.vue";
import AddressListModal from "./AddressListModal.vue";

export default {
  data() {
    return {
      users: [],
      modalOpen: false,
      selectUser: null,
      showEditModal: false,
      showDetailModal: false,
      showAddressModal: false,
    };
  },
  components: {
    ModalDatail,
    ModalEdit,
    AddressListModal,
  },
  methods: {
    datailModal(user) {
      this.selectUser = user;
      this.showDetailModal = true;
    },
    editModal(user) {
      this.selectUser = user;
      this.showEditModal = true;
    },
    addressModal(user) {
      this.selectUser = user;
      this.showAddressModal = true;
    },

    closeDetailModal() {
      this.showDetailModal = false;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    closeAddressModal() {
      this.showAddressModal = false;
    },

    async deleteUser(userId) {
      try {
        await axios.delete(`http://localhost:3333/person/${userId}`);
        await this.carregarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    },
    async carregarUsuarios() {
      axios
        .get("http://localhost:3333/person")
        .then((response) => {
          console.log(response.data);
          this.users = response.data;
          console.log("Dados atualizados:", this.users);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    async atualizarTabela() {
      try {
        // Recarregar os usuários após o evento update-table
        await this.carregarUsuarios();
      } catch (error) {
        console.error("Erro ao atualizar a tabela: ", error);
      }
    },
    editUser(userId) {},
  },
  mounted() {
    // Carregar os usuários ao iniciar o componente
    this.carregarUsuarios();
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* fundo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* sombra suave */
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
