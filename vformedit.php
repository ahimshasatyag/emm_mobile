<div class="container-fluid">

	<div class="row">
		<div class="col-12">
			<div class="page-title-box">
				<h4 class="page-title"><?= $title; ?> - <?= $data->code_po; ?></h4>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-12">
			<div class="card-box">
				<?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/update'), 'update' => '#pesan', 'type' => 'post', 'processData' => 'false', 'contentType' => 'false', 'upload' => 'true')); ?>
				<div class="row">
					<div class="col-xl-12">
						<div id="pesan">

						</div>
					</div>
					<div class="col-xl-12 text-left" style="margin-bottom: 10px;">
						<?php
						if (!$f_edit) {
							if ($data->status_po == 'QUOTATION' || $data->status_po == 'DRAFT') { ?>
								<button class="btn btn-info btn-sm btn-dua" type="button" onclick='show("<?= $folder; ?>/cform/edit/<?= $data->id_po; ?>/t","#main"); return false;'>Edit</button>

								<?php if (check_role($this->id_menu, 1)) { ?>
									<button class="btn btn-success btn-sm btn-satu" type="button" onclick='return confirm_po(<?= $data->id_po; ?>); false;'>Confirm to PO</button>
								<?php } ?>

								<button class="btn btn-warning btn-sm kembali btn-tiga" type="button" onclick='show("<?= $folder; ?>/cform/","#main"); return false;'>Kembali</button>


							<?php }
						} else { ?>

							<button class="btn btn-success btn-sm btn-satu" type="submit" value="Simpan" name="simpan" id="submit">Simpan</button>

							<a href="#" onclick="show('<?= $folder; ?>/cform/edit/<?= $data->id_po; ?>/f','#main'); return false;" class="btn btn-warning btn-sm pull-right btn-tiga"><i class="fa fa-undo"></i>
								&nbsp;Kembali</a>

						<?php } ?>
					</div>
					</br>
					</br>
					<div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

						<table style="width: 100%" class="table table-sm table-striped">
							<tbody>
								<tr>
									<td>Supplier</td>
									<td><select class="form-control form-control-sm" id="id_suppliers" name="id_suppliers" required <?php if (!$f_edit || $this->session->userdata('id_users_level') == 15) {
																																		echo 'disabled';
																																	} ?>>
											<option value=""></option>
											<?php if ($data_supplier->num_rows() > 0) {
												foreach ($data_supplier->result() as $row) { ?>
													<option value="<?= $row->id_suppliers; ?>" <?php if ($data->id_suppliers == $row->id_suppliers) {
																									echo 'selected';
																								} ?>><?= $row->nm_suppliers; ?></option>
											<?php 	}
											} ?>
										</select>
										<input type="hidden" id="id_po" name="id_po" value="<?= $data->id_po; ?>" />
										<input type="hidden" id="code_po" name="code_po" value="<?= $data->code_po; ?>" />
									</td>
								</tr>
								<tr>
									<td>Supplier Reference</td>
									<td>
										<input type="text" class="form-control form-control-sm" id="partner_ref" name="partner_ref" value="<?= $data->partner_ref; ?>"></input>
									</td>
								</tr>
								<tr>
									<td>Mata Uang</td>
									<td><select class="form-control form-control-sm" id="mata_uang" name="mata_uang" required <?php if (!$f_edit || $this->session->userdata('id_users_level') == 15) {
																																	echo 'disabled';
																																} ?>>
											<option value=""></option>
											<?php if ($mata_uangs->num_rows() > 0) {
												foreach ($mata_uangs->result() as $row) { ?>
													<option value="<?= $row->id_mata_uang; ?>" <?php if ($data->id_mata_uang == $row->id_mata_uang) {
																									echo 'selected';
																								} ?>><?= $row->name; ?></option>
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
									<td><input type="text" class="form-control form-control-sm tanggal" name="date_po" <?php if (!$f_edit || $this->session->userdata('id_users_level') == 15) {
																															echo 'disabled';
																														} ?> value="<?= date("d-m-Y", strtotime($data->date_po)); ?>" readonly></td>
								</tr>
								<tr>
									<td>Destination Warehouse</td>
									<td><select class="form-control form-control-sm" id="id_gudang" name="id_gudang" required <?php if (!$f_edit || $this->session->userdata('id_users_level') == 15) {
																																	echo 'disabled';
																																} ?>>
											<option value=""></option>
											<?php if ($data_gudang->num_rows() > 0) {
												foreach ($data_gudang->result() as $row) { ?>
													<option value="<?= $row->id_gudang; ?>" <?php if ($data->id_gudang == $row->id_gudang) {
																								echo 'selected';
																							} ?>><?= $row->nm_gudang; ?></option>
											<?php 	}
											} ?>
										</select></td>
								</tr>
								<tr>
									<td>Notes</td>
									<td>
										<textarea class="form-control form-control-sm" id="notes" name="notes"><?= $data->notes; ?></textarea>
									</td>
								</tr>
								<tr>
									<td>File</td>
									<td>
										<?php if (!$f_edit) { ?>
											<br />
											<?php if ($data->link_file) { ?>
												<a href="<?= base_url(); ?>assets/upload/<?= $data->link_file; ?>" target="_blank"><label class="btn btn-dark btn-sm pull-right btn-dua" for="link_file">Download File</label> </a>
											<?php } else { ?>
												<label class="btn btn-dark btn-sm pull-right btn-dua" for="link_file">Tidak ada File</label>
											<?php } ?>
										<?php } else { ?>
											<label class="btn btn-dark btn-sm pull-right btn-dua" for="link_file">Upload File</label>
											<input type="file" name="link_file" id="link_file" style="visibility:hidden;" />
										<?php } ?>
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
									<?php if ($f_edit && $this->session->userdata('id_users_level') != 15) { ?>

										<div class="col-xl-12 text-left">
											<button class="btn btn-info btn-sm btn-dua" type="button" id="addRow">Tambah Barang</button>
										</div>
									<?php } ?>

									<br />
									<br />

									<div class="col-xl-12">
										<div class="table-responsive">
											<table class="table-sm table-striped table-bordered display wrap" id="tbl_item" style="table-layout: fixed; word-wrap:break-word; border-collapse: collapse;" cellspacing="0" cellpadding="0" width="100%">
												<thead>
													<tr>
														<th class="text-center">No</th>
														<th class="text-center">Kode Barang</th>
														<th class="text-center">Nama Barang</th>
														<th class="text-center">Deskripsi</th>
														<th class="text-center">Notes</th>
														<th class="text-center">Satuan</th>
														<th class="text-center">Price</th>
														<th class="text-center">Qty</th>
														<th class="text-center">Subtotal</th>
														<th class="text-center">Aksi</th>
													</tr>
												</thead>
												<tbody>
													<?php
													$no = 1;
													if ($data_detail->num_rows() > 0) {
														foreach ($data_detail->result() as $row) { ?>
															<tr class="main-row" data-row="<?= $no; ?>">
																<td><span id="no_item<?= $no; ?>"><?= $no; ?></span></td>
																<td>
																	<select class="form-control form-control-sm id_products" id="id_product<?= $no; ?>" name="id_product<?= $no; ?>" required>
																		<option value=""></option>
																		<?php if ($data_product) {
																			foreach ($data_product->result() as $riw) { ?>
																				<option value="<?= $riw->id_product; ?>" <?php if ($row->id_product == $riw->id_product) { echo 'selected'; } ?>><?= $riw->code_product; ?></option>
																			<?php }
																		} ?>
																	</select>
																</td>
																<td><span id="nama_barang<?= $no; ?>"><?= $row->nm_product; ?></span></td>
																<td><span id="deskripsi_barang<?= $no; ?>"><?= $row->product_deskripsi; ?></span></td>
																<td><textarea class="form-control form-control-sm" name="notes<?= $no; ?>"><?= $row->notes; ?></textarea></td>
																<td><span id="satuan_barang<?= $no; ?>"><?= $row->nm_product_satuan; ?></span></td>
																<td><input type="text" class="form-control form-control-sm" value="<?= number_format($row->product_price, 2); ?>" id="product_price<?= $no; ?>" name="product_price<?= $no; ?>" onkeypress="return hanyaAngka(event)" onkeyup="subtotal_line(<?= $no; ?>); reformat(this);" required /></td>
																<td><input type="text" class="form-control form-control-sm" value="<?= number_format($row->qty, 2); ?>" id="qty<?= $no; ?>" name="nqty<?= $no; ?>" onkeypress="return hanyaAngka(event)" onkeyup="subtotal_line(<?= $no; ?>); max_qty(<?= $no; ?>, <?= $row->qty ?>); reformat(this);" required /></td>
																<td><span id="subtotal_line<?= $no; ?>" class="sub-total" style="float:right;"><?= number_format($row->product_price * $row->qty, 2); ?></span></td>
																<td><button type="button" title="Delete" class="btn btn-danger delete"><i class="fa fa-trash"></i></button></td>
															</tr>
															<!-- Tabel Opsi Produk -->
															<tr class="child-row" data-parent="<?= $no; ?>">
																<td colspan="10">
																	<table class="table-sm table-striped table-bordered display nowrap" style="width:100%; table-layout:auto; word-wrap:break-word; margin-bottom: 15px;" cellspacing="0" cellpadding="0" id="optionTable">
																		<thead>
																			<tr>
																				<th class="text-center">Nama Option</th>
																				<th class="text-center">Harga</th>
																				<th class="text-center">Action</th>
																			</tr>
																		</thead>
																		<tbody>
																		<?php
																			$options = $this->mmaster->get_product_options($row->id_po_dtl);
																			if ($options) {
																				foreach ($options as $opt) {
																					$is_checked = isset($opt->checked) && $opt->checked == 1 ? 'checked' : ''; ?>
																					<tr>
																						<td>
																							<input type="hidden" name="options[<?= $row->id_po_dtl ?>][<?= $opt->id_product ?>][nm_product_opt]" value="<?= $opt->nm_product_opt ?>" />
																							<?= $opt->nm_product_opt ?>
																						</td>
																						<td>
																							<input type="text" class="form-control form-control-sm" name="options[<?= $row->id_po_dtl ?>][<?= $opt->id_product ?>][harga]" value="<?= number_format($opt->harga, 2) ?>" onkeypress="return hanyaAngka(event)" />
																						</td>
																						<td class="text-center">
																							<input type="checkbox" name="options[<?= $row->id_po_dtl ?>][<?= $opt->id_product ?>][checked]" value="1" <?= $is_checked ?> />
																						</td>
																					</tr>
																			<?php }
																			}
																			?>

																		</tbody>
																	</table>
																</td>
															</tr>
														<?php $no++;
														}
													}
													?>
												</tbody>
											</table>
											<input type="hidden" name="jml" value="<?= $no - 1; ?>" id="jml">
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
												<input type="text" class="form-control form-control-sm tanggal" name="date_schdl" value="<?php if ($data->date_schdl != null) {
																																				echo date("d-m-Y", strtotime($data->date_schdl));
																																			} else {
																																				echo date("d-m-Y");
																																			}  ?>" readonly />
											</div>
										</div>
										<div class="form-group row">
											<label class="col-sm-2 col-form-label">Destination</label>
											<div class="col-sm-10">
												<select class="form-control form-control-sm" id="id_product_lokasi" name="id_product_lokasi" required>
													<option value=""></option>
													<?php if ($data_lokasi->num_rows() > 0) {
														foreach ($data_lokasi->result() as $row) { ?>
															<option value="<?= $row->id_product_lokasi; ?>" <?php if ($data->id_product_lokasi == $row->id_product_lokasi) {
																												echo 'selected';
																											} ?>><?= $row->complete_name; ?></option>
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


		$('.id_products').select2({
			placeholder: "Pilih Barang",
			width: '100%'
		});

		$("#id_product_lokasi").select2({
			placeholder: "Select Destination",
			width: '100%'
		});


		$('#mata_uang').select2({
			placeholder: "Select Currency",
			width: '100%'
		});


		$('#addRow').on('click', function() {
			let data_product = '<option></option><?php if ($data_product) {
				foreach ($data_product->result() as $row) {
					echo "<option value=\'" . $row->id_product . "\'>" . $row->code_product . " - " . $row->nm_product . "</option>";
				}
			} ?>';

			let no = parseInt($('#jml').val());
			no++;
			$('#jml').val(no);

			// Tabel Utama
			var $tr = $(`
				<tr class="main-row" data-row="${no}">
					<td><span id="no_item${no}">${no}</span></td>
					<td>
						<select class="form-control form-control-sm id_products" id="id_product${no}" name="id_product${no}" required>
							${data_product}
						</select>
					</td>
					<td>
						<span id="nama_barang${no}"></span>
						<input type="hidden" id="nm_product${no}" name="nm_product${no}" />
						<input type="hidden" id="code_product_input${no}" name="code_product${no}" />
					</td>
					<td>
						<span id="deskripsi_barang${no}"></span>
						<input type="hidden" id="product_deskripsi${no}" name="product_deskripsi${no}" />
					</td>
					<td>
						<textarea class="form-control form-control-sm" name="notes${no}"></textarea>
					</td>
					<td><span id="satuan_barang${no}"></span></td>
					<td><input type="text" class="form-control form-control-sm" id="product_price${no}" name="product_price${no}" onkeypress="return hanyaAngka(event)" onkeyup="subtotal_line(${no});reformat(this);" required /></td>
					<td><input type="text" class="form-control form-control-sm" id="qty${no}" name="nqty${no}" onkeypress="return hanyaAngka(event)" onkeyup="subtotal_line(${no});reformat(this);" required /></td>
					<td><span id="subtotal_line${no}" class="sub-total" style="float:right;"></span></td>
					<td><button type="button" title="Delete" class="btn btn-danger delete"><i class="fa fa-trash"></i></button></td>
				</tr>
			`);

			$('#tbl_item > tbody').append($tr);

			// aktifkan select2 pada dropdown produk
			$('#id_product' + no).select2({
				placeholder: 'Pilih Barang',
			});

			// Event Change Select Produk
			$('#id_product' + no).on('change', function () {
				let id_product = $(this).val();
				let $select = $(this);
				let $row = $select.closest('tr');

				// Dapatkan child-row jika sudah ada
				let $childRow = $row.next('.child-row');

				if (id_product) {
					$.ajax({
						type: "post",
						data: { 'id_product': id_product },
						url: "<?= base_url($folder . '/cform/get_product_detail'); ?>",
						dataType: 'json',
						success: function (data) {
							// Isi field utama
							$('#nama_barang' + no).html(data.nm_product);
							$('#deskripsi_barang' + no).html(data.product_deskripsi);
							$('#nm_product' + no).val(data.nm_product);
							$('#product_deskripsi' + no).val(data.product_deskripsi);
							$('#code_product_input' + no).val(data.code_product);
							$('#satuan_barang' + no).html(data.nm_product_satuan);

							if ($childRow.length) {
								let $tbody = $childRow.find('tbody');
								$tbody.empty();

								// Tambahkan opsi baru
								if (data.options && data.options.length > 0) {
									data.options.forEach(function (opt, idx) {
										$tbody.append(`
											<tr>
												<td>
													<input type="text" class="form-control form-control-sm" name="options[${no}][${idx}][nm_product_opt]" value="${opt.nm_product_opt}" readonly />
												</td>
												<td>
													<input type="text" class="form-control form-control-sm" name="options[${no}][${idx}][harga]" onkeypress="return hanyaAngka(event)" />
												</td>
												<td class="text-center">
													<input type="checkbox" name="options[${no}][${idx}][checked]" value="1" checked />
												</td>
											</tr>
										`);
									});

								}
							} else {
								// Belum ada tabel option, buat baru
								var $optionTable = $(`
									<tr class="child-row" data-parent="${no}">
										<td colspan="10">
											<table class="table-sm table-striped table-bordered" style="width:100%; margin-bottom:15px;">
												<thead>
													<tr>
														<th class="text-center">Nama Option</th>
														<th class="text-center">Harga</th>
														<th class="text-center">Action</th>
													</tr>
												</thead>
												<tbody></tbody>
											</table>
										</td>
									</tr>
								`);
								let $tbody = $optionTable.find('tbody');
								if (data.options && data.options.length > 0) {
									data.options.forEach(function (opt) {
										$tbody.append(`
											<tr>
												<td>
													<input type="text" class="form-control form-control-sm" name="nm_product_opt${no}[]" value="${opt.nm_product_opt}" readonly />
												</td>
												<td>
													<input type="text" class="form-control form-control-sm" name="harga${no}[]" onkeypress="return hanyaAngka(event)" />
												</td>
												<td class="text-center">
													<input type="checkbox" name="options${no}[]" value="${opt.nm_product_opt}" checked />
												</td>
											</tr>
										`);
									});
								} 
								$row.after($optionTable);
							}
						},
						error: function () {
							swal.fire("Maaf", "Data gagal diambil", "error");
						}
					});
				} else {
					// Jika produk dikosongkan, hapus opsi
					$childRow.remove();
				}

				
			});

		});

		// Event Delete Row
		$('#tbl_item').on('click', '.delete', function() {
			var $row = $(this).closest('tr');
			var no = $row.data('row');

			$row.next('.child-row[data-parent="'+no+'"]').remove();
			$row.remove();
		});


	});

	function subtotal_line(no) {

		let harga = formatulang($('#product_price' + no).val());
		let qty = formatulang($('#qty' + no).val());

		let sub_total = parseInt(qty) * parseInt(harga);

		if (isNaN(sub_total)) {
			$('#subtotal_line' + no).text('0');
		} else {
			$('#subtotal_line' + no).text(formatcemua(sub_total));
		}

	}

	function max_qty(no, max) {

		let qty = formatulang($('#qty' + no).val());

		if (qty > max) {
			$('#qty' + no).val(max)
		}


	}
</script>