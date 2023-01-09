<template>
    <div>
        <div class="row">
            <div class="col-md-4 shad" v-for="(dipot,index) in dipots" :key="index">
                <div class="card" >
                    <div class="card-header">
                        <router-link to = '/users'>
                            <h3 class="card-title">dipot 1</h3>
                        </router-link>
                        
                    </div>
                    <div class="card-body">
                        <div >
                            <div >
                                <div>
                                    <h4>changes : {{dipot.name}}</h4>
                                </div>
                                <div>
                                    <h4>capacity : {{dipot.capacity}}</h4>
                                </div>
                                <div style="display: flex;">
                                    <h4 style="display: inline;">adress : </h4 > <h5 style="display: inline;">{{dipot.adress}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            dipots : [
                {
                    name : 'dipot1',
                    capacity : 111,
                    adress : 'kenitra'
                },
                {
                    name : 'dipot2',
                    capacity : 121,
                    adress : 'rabat'
                },
                {
                    name : 'dipot4',
                    capacity : 332,
                    adress : 'kenitra'
                }
            ]
        }
    }
}
</script>
<style  scoped>
.shad :hover{
    box-shadow: 0 1px 2px rgba(255, 52, 157, 0.15);
    transition: box-shadow 0.3s ease-in-out;
}
</style>
