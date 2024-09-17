<template>
   
        <Navbar/>
        <v-container width="1300px" class="flex justify-center w-4/5 h-4/5 items-center h-screen">
        <v-row class="align-center fill-height">
            <v-col cols="10" class="d-flex justify-center align-center">
        <v-card elevation="8">
        <v-data-table hide-default-footer fixed-header height="600px" :headers="headers" :items="currencies.data" item-value="id">

            <thead>
        <tr>
          <th>Numer</th>
          <th>Waluta</th>
          <th>Opis</th>
          <th>Nazwa</th>
          <th>Symbol</th>
          <th>Edycja</th>
          <th>Usuń</th>
        </tr>
      </thead>
      <tbody>
       
        <tr v-for="(item, index) in currencies.data" :key="index">
          <td>{{ index + 1 }}</td> 
          <td>{{ item.currency }}</td>
          <td>{{ item.description }}</td> 
          <td>{{ item.name}}</td>
          <td>{{ item.symbol}}</td>
          <td><v-btn icon @click="openEditDialog(item, index)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn></td>
          <td> <v-btn icon @click="DeleteData(index)">
        <v-icon>mdi-delete</v-icon>
      </v-btn></td>
        </tr>
      </tbody>
      </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="2" class="d-flex justify-center align-center">
        <v-btn class="btn-add" elevation="8" @click="openAddDialog"><v-icon size="30">mdi mdi-plus</v-icon></v-btn>
    </v-col>
    </v-row>
      
      <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edytuj Walutę</span>
        </v-card-title>
        <v-card-subtitle>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.description"
              label="Opis"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Anuluj</v-btn>
          <v-btn color="primary" @click="saveItem">Zapisz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="adder" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Dodaj Walutę</span>
        </v-card-title>
        <v-card-subtitle>
          <v-form ref="addForm" v-model="valid">
            <v-text-field
            v-model="NewItemAd.curren"
              label="Waluta"
              required
            ></v-text-field>
            <v-text-field
               v-model="NewItemAd.desc"
              label="Opis"
              
              required
            ></v-text-field>
            <v-text-field
            v-model="NewItemAd.name"
              label="Nazwa"
              required
            ></v-text-field>
            <v-text-field
            v-model="NewItemAd.symbol"
              label="Symbol"
              required
            ></v-text-field>
          </v-form>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeAdd">Anuluj</v-btn>
          <v-btn color="primary" @click="AddItem">Zapisz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-container>
      

        
   
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

const currencies = reactive({
   data: [],
    
});  
 
const userAuthToken = reactive(localStorage.userAuthToken);
const dialog = ref(false);
const adder = ref(false);
const valid = ref(true);
var CurrentEditID = 0;



const NewItemAd = ref({
    desc: '',
    name: '',
    curren: '',
    symbol: ''
    });

const editedItem = ref({});
// URL bazowy API
const apiHost = 'https://banknotes.mwlodar.com/currencies/';

const rules = {
      required: value => !!value || 'Required.'
    };

    function openEditDialog(item, id) {
        CurrentEditID = id;
  editedItem.value = { ...item };
  console.log('Opening dialog for item with ID:', CurrentEditID);
  dialog.value = true;
}

function openAddDialog() {
        
 adder.value = true;
}

    function closeDialog() {
      dialog.value = false;
    }

    function closeAdd() {
      adder.value = false;
    }

const updateCurrency = async (ID) => {
    try {
        const updatedDescription = editedItem.value.description;
        console.log(updatedDescription);
        await axios.patch(`https://banknotes.mwlodar.com/currencies/${currencies.data[ID].currency}/`, { description: updatedDescription },{
            
        });
        updateData();
        
    } catch (error) {
        console.error('Błąd podczas aktualizacji waluty:', error);
    }
};

const DeleteData = async (ID) => {
    try {
        
        
        await axios.delete(`https://banknotes.mwlodar.com/currencies/${currencies.data[ID].currency}/`,{
            
        });
        updateData();
        
    } catch (error) {
        console.error('Błąd podczas aktualizacji waluty:', error);
    }
};

const updateData = async () => {
    try {
        const response = await axios.get(apiHost, { headers: { "Authorization": `Token ${userAuthToken}` } });
        currencies.data = response.data;
        console.log(currencies);
    } catch (error) {
        console.log("Błąd pobierania obrazów", error);
    } finally {
        
    }
};

function saveItem() {
  
    updateCurrency(CurrentEditID);
    closeDialog();
}


const AddItem = async () => {
    try {
    
     
        const response = await axios.post('https://banknotes.mwlodar.com/currencies/', {
            currency: NewItemAd.value.curren,
            description: NewItemAd.value.desc,
            symbol: NewItemAd.value.symbol,
            name: NewItemAd.value.name,
            headers: {
          'Content-Type': 'multipart/form-data'
        }
        });
        updateData();
        adder.value = false;
        
    } catch (error) {
        console.error('Błąd podczas aktualizacji waluty:', error);
    }
};


onMounted(async () => {
    updateData();
});


</script>

<style scoped>
.btn-add{
    border-radius: 25px;
    width: 100px;
    height: 100px;
}
</style>
