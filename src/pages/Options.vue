<template>
<div class="row">
    <div class="col-12">
        <a href="" class="btn btn-primary btn-round" @click.prevent="toggleModal()"><i class="tim-icons icon-simple-add"></i></a>
        <card :title="title">
            <!-- <a href="" class="btn-group btn-group-toggle float-right" @click.prevent="addCategory()"><i class="tim-icons icon-simple-add"></i></a> -->
            
            <div class="table-responsive">
                <table class="table tablesorter">
                    <thead>
                        <tr>
                            <slot name="columns">
                                <th v-for="column in tableColumns" :key="column">{{column}}</th>
                            </slot>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in options" :key="item.id">
                            <slot>
                                <td>
                                    {{item.id}}
                                </td>
                                <td>
                                    {{item.option_name}}
                                </td>
                                <td>
                                    <!-- {{values(item.option_values)}} -->
                                    <span v-for="val in item.option_values" :key="val.id">{{`${val.value} , `}}</span>                                </td>
                                <td>
                                    <a href="" class="nav-link" @click.prevent="showUpdateModal(item)"> <i class="tim-icons icon-pencil"></i></a>
                                    <a href="" class="nav-link" @click.prevent="deleteOption(item.id)"> <i class="tim-icons icon-trash-simple"></i></a>
                                </td>
                            </slot>
                        </tr>
                    </tbody>
                </table>
            </div>
        </card>
    </div>
    <transition name="modal" v-if="showModal">
		<div class="modal-mask">
			<div class="modal-wrapper">
          <div class="modal-container">
            
              <div class="modal-header">
                <slot name="header">
                  Add new category
                </slot>
              </div>

              <div class="modal-body">
                  <slot >
                      <div class="input-data">
                          <input type="text" v-model="form.option_name" required>
                          <label for="name">Option name</label>
                      </div>
                      <div class="input-data">
                          <input type="text" v-model="form.position" required>
                          <label for="name">position</label>
                      </div>
                                
                  </slot>
                    <div >
                        <div v-for="(value,index) in this.form.option_values" :key="index" class="input-data-values">
                            <input type="text"  placeholder="value" v-model="value.value" required>

                            <input type="text"  placeholder="position" v-model="value.position" required>
                            <button @click="deleteOptionValue(index)">
                                <i class="tim-icons icon-trash-simple"></i>
                            </button>
                        </div>
                        
                    </div>
                    <a href="" class="btn btn-primary btn-round" @click.prevent="addOptionValue()"><i class="tim-icons icon-simple-add"></i></a>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                    <button class="modal-default-button" @click="addCategory()">
                        save
                    </button>
                    <button class="modal-cancel-button" @click="cancelHandle">
                        cancel
                    </button>
                </slot>
              </div>
            
          </div>
			</div>
		</div>
	</transition>
</div>
</template>

<script>
import {
    BaseTable
} from "@/components";
import {
    mapActions,
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            title: "Options list",
            tableColumns: ["id", "Option Name", "values","actions"],
            options: [],
            form : {
                id : '',
                option_name : '',
                position : '',
                option_values : [{
                    id : '',
                    value : '',
                    posistion : ''
                }]
            },
            showModal: false,
            isUpdate : false
        };
    },
    methods: {
        ...mapActions({
            fetchOptions: 'options/fetchOptions',
            destroyOption: 'options/destroyOption',
            NewOption: 'options/NewOption',
            updateOption: 'options/updateOption',
        }),
        addOptionValue(){
            this.form.option_values.push({
                value : '',
                posistion : ''
            })
        },
        deleteOptionValue: function (index) {
            this.form.option_values.splice(index, 1);
            if(index===0)
            this.addOptionValue()
        },
        async fillOptions() {
            await this.fetchOptions()
                .then(() => {
                    this.options = this.getOptions
                })
        },
        deleteOption(option_id) {
            Swal.fire({
                title: 'Delete Category',
                text: "Are you sure yo want to delete this option ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#b2bec3',
                confirmButtonText: 'delete!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.destroyOption(option_id)
                    this.fillOptions()
                    Swal.fire(
                        'Deleted!',
                        'the category has been deleted.',
                        'success'
                    )
                }
            })
        },
        cancelHandle(){
            this.showModal = false
            this.isUpdate = false
            this.form.id = ''
            this.form.option_name = ''
            this.form.position = null
            this.form.option_values = [{value : '',posistion : ''}]
        },
        toggleModal() {
           this.showModal = true;
        },
        showUpdateModal(form) {
            this.form.id = form.id
            this.form.option_name = form.option_name
            this.form.option_values = form.option_values
            this.showModal = true;
            this.isUpdate = true;
        },
        addCategory(){
            if(this.isUpdate){
                if(this.form.option_name != ""){
                    this.updateOption(this.form)
                    this.fillOptions()
                    this.showModal = false;
                    this.isUpdate = false;
                    this.form.id = ''
                    this.form.option_name = ''
                    this.form.position = ''
                    this.form.option_values = [{value : '',posistion : ''}]
                }
                console.log('modal runs')
            }
            else{
                if(this.form.option_name != ""){
                    this.NewOption(this.form)
                    this.form.option_name = ''
                    this.form.position = ''
                    this.form.option_values = [{value : '',posistion : ''}]
                    this.fillOptions()
                    this.showModal = false;
                }
                else{
                    console.log('something went wrong')
                }

            }
            
        }
    },
    computed: {
        ...mapGetters({
            'getOptions': 'options/getOptions',
        })
    },
    created() {
        this.fillOptions()
    }
};
</script>

<style scoped>
.table-responsive {
    overflow: hidden;
}

.nav-link {
    display: inline;
}
.btn-primary{
    float: right;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  -webkit-transition: opacity 0.3s ease;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 25rem;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
    background: #e14eca;
    /* background-image: linear-gradient(to bottom left, #e14eca, #ba54f5, #e14eca); */
    padding: 20px;
    color: #fff;
}

.modal-header h3 {
  margin: 0;
  color: white;
}

.modal-body {
  margin: 10px 0px;
  padding: 20px 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
          align-items: center;
}
.modal-footer .modal-default-text {
  -webkit-box-flex: 1;
          flex: 1;
}
.modal-footer .modal-default-button {
  cursor: pointer;
  background: #e14eca;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.modal-footer .modal-default-button:hover {
  background-color: #673dcb;
}
.modal-footer .modal-cancel-button {
  cursor: pointer;
  background: #673dcb;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.modal-footer .modal-cancel-button:hover {
  background-color: #673dcb;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.wrapper
{
  width: 450px;
  background: #fff;
  padding: 30px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
}

.input-data
{
  height: 40px;
  width: 100%;
  position: relative;
  margin-bottom: 25px;
}

.input-data-values
{
  height: 40px;
  width: 100%;
  position: relative;
  display: flex;
  margin-top: 10px;
}
.input-data-values input
{
    margin-right: 5px;
  height: 100%;
  width: 40%;
  border: none;
  font-size: 12px;
  border-bottom: 2px solid #57606f;
}
.input-data-values button{
    border: none;
    color: #e14eca;
    background-color: transparent;
    cursor: pointer;
}

.input-data-values input:focus
{
  border-bottom: 2px solid #341f97;
}
.input-data-values label
{
  position: absolute;
  bottom: 10px;
  left: 0;
  color: #57606f;
  pointer-events: none;
  transition: all 0.3s ease;
}

.wrapper .input-data input
{
  height: 100%;
  width: 100%;
  border: none;
  font-size: 17px;
  border-bottom: 2px solid #57606f;
}

.input-data input:focus ~ label,
.input-data input:valid ~ label
{
  transform: translateY(-20px);
  font-size: 15px;
  color: #4158d0;
}

.input-data input:focus
{
  border-bottom: 2px solid #341f97;
}

.wrapper .input-data label
{
  position: absolute;
  bottom: 10px;
  left: 0;
  color: #57606f;
  pointer-events: none;
  transition: all 0.3s ease;
}
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  box-shadow: none;
  border: 0 !important;
  background: #2c3e50;
  background-image: none;
}
/* Remove IE arrow */
select::-ms-expand {
  display: none;
}
/* Custom Select */
.select {
  position: relative;
  display: flex;
  width: 100%;
  height: 3em;
  line-height: 3;
  background: #2c3e50;
  overflow: hidden;
  border-radius: .25em;
  margin-top: 10px;
}

select {
  flex: 1;
  padding: 0 .5em;
  color: #fff;
  cursor: pointer;
}
/* Arrow */
.select::after {
  content: '\25BC';
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 1em;
  background: #34495e;
  cursor: pointer;
  pointer-events: none;
  -webkit-transition: .25s all ease;
  -o-transition: .25s all ease;
  transition: .25s all ease;
}
/* Transition */
.select:hover::after {
  color: #f39c12;
}
</style>
