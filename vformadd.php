<div class="container-fluid">

    <div class="row">
        <div class="col-12">
            <div class="page-title-box">
                <h4 class="page-title"><?=$title;?></h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card-box">
                <?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/simpan'), 'update' => '#pesan', 'type' => 'post')); ?>
                <div class="row">
                    <div class="col-xl-12">
                        <div id="pesan">

                        </div>
                    </div>
                    <div class="col-xl-6">
                        <div class="form-group row">
                            <label class="col-lg-4 col-form-label col-form-label-sm">Product</label>
                            <div class="col-lg-8">
                                <select class="form-control form-control-sm" name="id_product" id="id_product" required>
                                <?php if($data_product){
                                    echo "<option></option>";
                                    foreach ($data_product->result() as $row) { ?>
                                        <option value="<?= $row->id_product; ?>"><?= $row->code_product; ?> | <?= $row->nm_product; ?></option>
                                    <?php }
                                } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <button class="btn btn-success btn-sm fas-fa-save btn-satu" type="submit" value="Simpan" name="simpan"
                            id="submit">Simpan</button>
                        <a href="#"
                            onclick="show('<?=$folder;?>/cform/','#main'); return false;"
                            class="btn btn-info btn-sm btn-tiga"><i class="fa fa-undo"></i>
                            &nbsp;Kembali</a> 
                    </div>
                </div>
                </form>
                <!-- End Row -->
            </div>
        </div>

    </div>
</div>

<script>
$("form").submit(function(event) {
    event.preventDefault();
    $("input").attr("disabled", true);
    $("select").attr("disabled", true);
    $("#submit").attr("disabled", true);
});

$(document).ready(function() {
    $('#id_product').select2({
        'placeholder': 'Select Product'
    });

	$('#username').select2({
        'placeholder': 'Select User'
    });


});
</script>