<div class="container-fluid">

	<div class="row">
		<div class="col-12">
			<div class="page-title-box">
				<h4 class="page-title"><?= $title; ?></h4>
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
					<div class="col-xl-12 text-left" style="margin-bottom: 10px;">
						<button class="btn btn-success btn-sm btn-satu" type="submit" value="Simpan" name="simpan" id="submit">Save</button>

						<a href="#" onclick="show('<?= $folder; ?>/cform/','#main'); return false;" class="btn btn-warning btn-sm pull-right btn-tiga">Discard</a>
					</div>
					</br>
					</br>
					<div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

						<table style="width: 100%" class="table table-sm table-striped">
							<tbody>
								<tr>
									<td>Supplier</td>
									<td><select class="form-control form-control-sm" id="id_suppliers" name="id_suppliers" required onchange="pilih_mata_uang_default()">
											<option value=""></option>
											<?php if ($data_supplier->num_rows() > 0) {
												foreach ($data_supplier->result() as $row) { ?>
													<option value="<?= $row->id_suppliers; ?>"><?= $row->nm_suppliers; ?></option>
											<?php 	}
											} ?>
										</select></td>
								</tr>
								<tr>
									<td>Supplier Reference</td>
									<td>
										<input type="text" class="form-control form-control-sm" id="partner_ref" name="partner_ref"></input>
									</td>
								</tr>
								<tr>
									<td>Mata Uang</td>
									<td><select class="form-control form-control-sm" id="mata_uang" name="mata_uang" required>
											<option value=""></option>
											<?php if ($mata_uangs->num_rows() > 0) {
												foreach ($mata_uangs->result() as $row) { ?>
													<option value="<?= $row->id_mata_uang; ?>"><?= $row->name; ?></option>
											<?php 	}
											} ?>
										</select></td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="col-lg-6 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">
						<table style="width: 100%" class="table table-sm table-striped">
							<tbody>

								<tr>
									<td>Order Date</td>
									<td><input type="text" class="form-control form-control-sm tanggal" name="date_po" value="<?= date('d-m-Y'); ?>" readonly></td>
								</tr>
								<tr>
									<td>Destination Warehouse</td>
									<td>
										<select class="form-control form-control-sm" id="id_gudang" name="id_gudang" required>
											<option value=""></option>
											<?php if ($data_gudang->num_rows() > 0) {
												foreach ($data_gudang->result() as $row) { ?>
													<option value="<?= $row->id_gudang; ?>" <?php if($row->id_gudang == 2){ echo "selected"; } ?>><?= $row->nm_gudang; ?></option>
											<?php 	}
											} ?>
										</select>
									</td>
								</tr>
								<tr>
									<td>Notes</td>
									<td>
										<textarea class="form-control form-control-sm" id="notes" name="notes"></textarea>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="col-xl-12">
						<ul class="nav nav-tabs" id="myTab" role="tablist">
							<li class="nav-item">
								<a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-expanded="true" aria-selected="true">Purchase Order</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Incoming Shipment & Invoice</a>
							</li>
						</ul>
						<div class="tab-content text-muted" id="myTabContent">
							<div role="tabpanel" class="tab-pane fade in active show" id="home" aria-labelledby="home-tab">
								<div class="row">
									<div class="col-xl-12 text-left">
										<button class="btn btn-info btn-sm btn-dua" type="button" id="addRow">Tambah Barang</button>
									</div>

									<br />
									<br />

									<div class="col-xl-12">
										<div class="table-responsive">
										<table class="table-sm table-striped table-bordered display wrap" style="table-layout: fixed;word-wrap:break-word;border-collapse: collapse;" cellspacing="0" cellpadding="0" width="100%" id="tbl_item">
											<thead>
												<tr>
												<th class="text-center" style="width: 20px;">No</th>
												<th class="text-center" style="width: 100px;">Kode Barang</th>
												<th class="text-center" style="width: 100px;">Nama Barang</th>
												<th class="text-center" style="width: 100px;">Deksripsi</th>
												<th class="text-center" style="width: 100px;">Notes</th>
												<th class="text-center" style="width: 100px;">Satuan</th>
														<!-- <th class="text-center" style="width: 100px;">Analytic Account</th> -->
												<th class="text-center" style="width: 100px;">Price</th>
												<th class="text-center" style="width: 100px;">Qty</th>
														<!-- <th class="text-center" style="width: 100px;">Taxes</th> -->
												<th class="text-center" style="width: 100px;">Subtotal</th>
												<th class="text-center" style="width: 50px;">Aksi</th>
												</tr>
											</thead>
												<tbody id="tbody_item">
											</tbody>
											</table>
											<input type="hidden" name="jml" value="0" id="jml">
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
								<div class="row">
									<div class="col-xl-6">
										<div class="form-group row">
											<label class="col-sm-2 col-form-label">Expected Date</label>
											<div class="col-sm-10">
												<input type="text" class="form-control form-control-sm tanggal" name="date_schdl" value="" readonly/>
											</div>
										</div>
										<div class="form-group row">
											<label class="col-sm-2 col-form-label">Destination</label>
											<div class="col-sm-10">
												<select class="form-control form-control-sm" id="id_product_lokasi" name="id_product_lokasi" required>
													<option value=""></option>
													<?php if ($data_lokasi->num_rows() > 0) {
														foreach ($data_lokasi->result() as $row) {
															if($row->id_gudang != 2){
																continue;
															}
															?>
															<option value="<?= $row->id_product_lokasi; ?>" <?php if($row->id_product_lokasi == 20){ echo "selected"; } ?>><?= $row->complete_name; ?></option>
													<?php 	}
													} ?>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				</form>
				<!-- End Row -->
			</div>
		</div>

	</div>
</div>

<script type="text/javascript">
	$(document).ready(function() {
		showCalendar('.tanggal');
		$('#id_suppliers').select2({
			placeholder: "Select Suppliers",
			width: '100%'
		});

		$('#id_gudang').select2({
			placeholder: "Select Warehouse",
			width: '100%'
		});

		let product_lokasi =  $("#id_product_lokasi").select2({
			placeholder: "Select Destination",
			width: '100%'
		});


		$('#mata_uang').select2({
			placeholder: "Select Currency",
			width: '100%'
		});

		var t = $('#tbl_item').DataTable({
			"responsive": true,
			"info": false,
			"paging": false,
			"searching": false,
			"ordering": false,
			"autoWidth": false
		});

		$('#addRow').on('click', function() {

			let data_product = '<option></option><?php if ($data_product) {
														foreach ($data_product->result() as $row) { ?><option value="<?= $row->id_product; ?>"><?= $row->code_product; ?></option><?php }
																															} ?>';

			let no = $('#jml').val();
			no++;
			$('#jml').val(no);
			t.row.add([
				'<span id="no_item' + no + '">' + no + '</span>',
				'<select class="form-control form-control-sm" id="id_product' + no + '" name="id_product' + no + '" required>' + data_product + '</select>',
				'<span>' +
					'<span id="nama_barang' + no + '"></span>' +
					'<input type="hidden" id="nm_product' + no + '" name="nm_product' + no + '" />' +
					'<input type="hidden" id="code_product_input' + no + '" name="code_product' + no + '" />' +
				'</span>',
				'<span>' +
					'<span id="deskripsi_barang' + no + '"></span>' +
					'<input type="hidden" id="product_deskripsi' + no + '" name="product_deskripsi' + no + '" />' +
				'</span>',
				'<textarea class="form-control form-control-sm" name="notes' + no + '" ></textarea>',
				'<span id="satuan_barang' + no + '"></span>',
				'<input type="text" class="form-control form-control-sm" id="product_price' + no + '" name="product_price' + no + '" onkeypress="return hanyaAngka(event)" onkeyup="subtotal_line(' + no + ');reformat(this);" required />',
				'<input type="text" class="form-control form-control-sm" id="qty' + no + '" name="nqty' + no + '" onkeypress="return hanyaAngka(event)" onkeyup="subtotal_line(' + no + ');reformat(this);" required />',
				'<span id="subtotal_line' + no + '" class="sub-total" style="float:right;"></span>',
				'<button type="button" title="Delete" class="btn btn btn-danger delete"><i class="fa fa-trash"></i></button>',
			]).draw(false);

			$('#id_product' + no).select2({
				'placeholder': 'Pilih Barang',
				// 'dropdownAutoWidth' : true
			});

			$('#id_product' + no).on('change', function() {
				let id_product = $(this).val();
				let $select = $(this);
				let $row = t.row($select.closest('tr')); 

				if ($row.child.isShown()) {
					$row.child.hide();
				}

				// search nama barang dan deksripsi barang
				$.ajax({
					type: "post",
					data: {
						'id_product': id_product
					},
					url: "<?= base_url($folder . '/cform/get_product_detail'); ?>",
					dataType: 'json',
					success: function(data) {
						$('#nama_barang' + no).html(data.nm_product);
						$('#deskripsi_barang' + no).html(data.product_deskripsi);

						$('#nm_product' + no).val(data.nm_product);
						$('#product_deskripsi' + no).val(data.product_deskripsi);
						$('#code_product_input' + no).val(data.code_product);

						$('#satuan_barang' + no).html(data.nm_product_satuan);

						// Tabel option
						let $optionTable = $('<table class="table-sm table-striped table-bordered display nowrap" id="table_option' + no + '" style="width: 100%; table-layout: auto; word-wrap: break-word; margin-bottom: 15px;" cellspacing="0" cellpadding="0">' +
							'<thead>' +
							'<tr>' +
							'<th class="text-center">Nama Option</th>' +
							'<th class="text-center">Harga</th>' +
							'<th class="text-center">Action</th>' +
							'</tr>' +
							'</thead>' +
							'<tbody></tbody>' +
							'</table>');

						if (data.options && data.options.length > 0) {
							data.options.forEach(function(opt) {
								$optionTable.find('tbody').append(`
									<tr>
										<td>
											<input type="text" class="form-control form-control-sm" name="nm_product_opt${no}[]" value="${opt.nm_product_opt}" readonly />
										</td>
										<td>
											<input type="text" class="form-control form-control-sm" name="harga${no}[]" onkeypress="return hanyaAngka(event)" />
										</td>
										<td class="text-center">
											<input type="checkbox" name="options${no}[]" value="${opt.nm_product_opt}" />
										</td>
									</tr>
								`);
							});
							$row.child($optionTable).show();
						}else {
							$optionTable.find('thead').hide();
							$optionTable.find('tbody').html();
							$row.child($optionTable).show();
						}
					},

					error: function () {
						swal.fire("Maaf", "Data gagal diambil", "error");
					}
				});
			});
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

		$("#id_gudang").on('change', function() {
			let id_gudang = $(this).val();

			$.ajax({
				type: "post",
				data: {
					'id_gudang': id_gudang
				},
				url: "<?= base_url($folder . '/cform/get_lokasi'); ?>",
				dataType: 'json',
				success: function(data) {
					product_lokasi.empty();
					product_lokasi.append('<option></option>');
					$.each(data, function(i, row) {
						product_lokasi.append('<option value="' + row.id_product_lokasi + '">' + row.complete_name + '</option>');
					});
					product_lokasi.val(data[0].id_product_lokasi);
					product_lokasi.trigger('change');
				},
				error: function() {
					swal.fire("Maaf", "Data gagal di Ambil", "error");
				}
			});
		});


	});

	function subtotal_line(no) {

		let harga = formatulang($('#product_price' + no).val());
		let qty = $('#qty' + no).val();

		let sub_total = parseInt(qty) * parseInt(harga);

		if (isNaN(sub_total)) {
			$('#subtotal_line' + no).text('0');
		} else {
			$('#subtotal_line' + no).text(formatcemua(sub_total));
		}

	}

	function pilih_mata_uang_default() {

		let id_supplier = $('#id_suppliers').val();

		$.ajax({
			type: "post",
			data: {
				'id_supplier': id_supplier
			},
			url: "<?= base_url($folder . '/cform/get_mata_uang_default'); ?>",
			dataType: 'json',
			success: function(data) {
				$('#mata_uang').val(data.id_mata_uang);
				$('#mata_uang').trigger('change');
			},
			error: function() {
				swal.fire("Maaf", "Data gagal di Ambil", "error");
			}
		});

	}
</script>