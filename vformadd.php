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
                <form method="post" action="<?=site_url($folder . '/cform/simpan');?>" enctype="multipart/form-data"
                    id="myform">
                    <div class="row">
                        <div class="col-xl-12">
                            <div id="pesan">

                            </div>
                        </div>

                        <div class="col-xl-6">
                            <table class="table table-sm table-striped">
                                <tbody>
                                    <tr>
                                        <th width="27%">Supplier Name</th>
                                        <th width="5%">:</th>
                                        <th><input required="" name="nm_suppliers" class="form-control form-control-sm"
                                                type="text" /></th>
                                    </tr>
                                    <tr>
                                        <th scope="row">Mobile</th>
                                        <th>:</th>
                                        <td><input type="text" name="suppliers_mobile"
                                                class="form-control form-control-sm"
                                                onkeypress="return hanyaAngka(event)" maxlength="15" /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Email</th>
                                        <th>:</th>
                                        <td><input type="email" name="suppliers_email"
                                                class="form-control form-control-sm" /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Address</th>
                                        <th>:</th>
                                        <td><textarea required="" name="suppliers_address"
                                                class="form-control form-control-sm" rows="3" type="text"></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-xl-6">
                            <table class="table table-sm table-striped">
                                <tbody>
                                    <tr>
                                        <th width="27%">Phone </th>
                                        <th width="5%">:</th>
                                        <td><input required="" name="suppliers_phone"
                                                class="form-control form-control-sm"
                                                onkeypress="return hanyaAngka(event)" maxlength="15" type="text" /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Fax</th>
                                        <th>:</th>
                                        <td><input type="text" name="suppliers_fax"
                                                class="form-control form-control-sm" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Website</th>
                                        <th>:</th>
                                        <td><input name="suppliers_website" class="form-control form-control-sm"
                                                type="text" /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Logo</th>
                                        <th>:</th>
                                        <td><input class="form-control form-control-sm" type="file" name="file" id="file">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Mata Uang</th>
                                        <th>:</th>
                                        <td>
                                            <select class="form-control form-control-sm" name="mata_uang">
                                                <?php if($mata_uangs->num_rows() > 0) {

                                                    foreach ($mata_uangs->result() as $mata_uang) { ?>
                                                        <option value="<?= $mata_uang->id_mata_uang ?>"><?= $mata_uang->name ?></option>
                                                    <?php }

                                                } ?>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        <div class="col-xl-12">
                            <button class="btn btn-success btn-sm" type="submit" value="Simpan" name="simpan"
                                id="submit">Simpan</button>


                            <button class="btn btn-info btn-sm" type="button" id="addRow">Tambah
                                Kontak</button><input type="hidden" name="jml" id="jml" value="0" />

                            <?php if (check_role($this->id_menu, 1)) {?><a href="#"
                                onclick="show('<?=$folder;?>/cform/','#main'); return false;"
                                class="btn btn-warning btn-sm pull-right"><i class="fa fa-undo"></i>
                                &nbsp;Kembali</a>
                            <?php }?>
                        </div>

                        </br>
                        </br>
                        <div class="col-xl-12">
                            <!-- <div class="table-responsive"> -->
                            <table class="table-sm table-striped table-bordered table-bordered dt-responsive nowrap"
                                style="border-collapse: collapse; border-spacing: 0; width: 100%; display nowrap"
                                id="tbl_item">
                                <thead>
                                    <tr>
                                        <th class="text-center" style="width: 30px">No</th>
                                        <th class="text-center" style="width: 150px">Contact Name</th>
                                        <th class="text-center" style="width: 150px">Position</th>
                                        <th class="text-center" style="width: 150px">Phone</th>
                                        <th class="text-center" style="width: 150px">Email</th>
                                        <th class="text-center" style="width: 100px">Action</th>
                                    </tr>
                                </thead>
                            </table>
                            <!-- </div> -->
                        </div>
                    </div>
                </form>
                <!-- End Row -->
            </div>
        </div>

    </div>
</div>

<script>
$(document).ready(function(e) {
    // $('#myform').on('submit', (function(e) {
    //     e.preventDefault();

    // }));

    var t = $('#tbl_item').DataTable({
        "info": false,
        "paging": false,
        "searching": false,
        "ordering": false
    });

    $('#addRow').on('click', function() {
        let no = $('#jml').val();
        no++;
        $('#jml').val(no);
        t.row.add([
            '<span id="no_item' + no + '">' + no + '</span>',
            '<input type="text" class="form-control form-control-sm" value="" name="nm_suppliers_contact' +
            no + '" id="nm_suppliers_contact' + no + '" required />',
            '<input type="text" class="form-control form-control-sm" value="" name="suppliers_contact_posisi' +
            no + '" id="suppliers_contact_posisi' + no + '" required />',
            '<input type="text" class="form-control form-control-sm" value="" name="suppliers_contact_phone' +
            no + '" id="suppliers_contact_phone' + no +
            '" required onkeypress="return hanyaAngka(event)" />',
            '<input type="email" class="form-control form-control-sm" value="" name="suppliers_contact_email' +
            no + '" id="suppliers_contact_email' + no + '" />',
            '<button type="button" title="Delete" class="btn btn btn-danger delete"><i class="fa fa-trash"></i></button>',
        ]).draw(false);

    });

    $('#tbl_item').on('click', '.delete', function() {
        if ($(this).closest('table').hasClass("collapsed")) {
            var child = $(this).parents("tr.child");
            row = $(child).prevAll(".parent");
        } else {
            row = $(this).parents('tr');
        }
        t.row(row).remove().draw();
    });


});

$("form").submit(function(event) {
    event.preventDefault();
    var formData = new FormData(this);

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            $("input").attr("disabled", true);
            $("select").attr("disabled", true);
            $("#submit").attr("disabled", true);

            $('#pesan').html(data);
        },
        error: function(data) {
            console.log("error");
            console.log(data);
        }
    });


});
</script>