<div class="container-fluid">

	<div class="row">
		<div class="col-12">
			<div class="page-title-box">
				<h4 class="page-title">
					<?= $title; ?>
				</h4>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-12">
			<div class="card-box">
				<?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/update'), 'update' => '#pesan', 'type' => 'post')); ?>
				<div class="row">
					<div class="col-xl-12">
						<div id="pesan">

						</div>
					</div>
					<div class="col-xl-6">
						<div class="form-group row">
							<label class="col-lg-4 col-form-label col-form-label-sm">Product</label>
							<div class="col-lg-8">
								<select class="form-control form-control-sm" name="id_product" id="id_product" required
									<?php if (!$f_edit || ($data->status == "CONFIRM" && $f_edit)) {
										echo 'disabled';
									} ?>>
									<?php if ($data_product) {
										echo "<option></option>";
										foreach ($data_product->result() as $row) { ?>
											<option value="<?= $row->id_product; ?>" <?php if ($row->id_product == $data->id_product) {
												  echo "selected";
											  } ?>>
												<?= $row->code_product; ?> |
												<?= $row->nm_product; ?>
											</option>
										<?php }
									} ?>
								</select>
							</div>
						</div>
					</div>


					<div class="col-xl-6">
						<div class="form-group row">
							<label class="col-lg-4 col-form-label col-form-label-sm">Status</label>
							<label class="col-lg-8 col-form-label col-form-label-sm">
								<?= $data->status; ?>
							</label>
							<input type="hidden" name="f_acc" value="<?= $f_acc ? '1' : '0'; ?>" />
							<input type="hidden" name="id" value="<?= $data->id; ?>" />
						</div>
					</div>

					<div class="col-xl-12">
						<?php if (check_role($this->id_menu, 3)) {

								if (!$f_edit) { ?>
								<?php if ($data->status == "DRAFT") { ?>
									<button class="btn btn-info btn-sm btn-dua" type="button"
										onclick='show("<?= $folder; ?>/cform/edit/<?= $data->id; ?>/t","#main"); return false;'>Edit</button>

									<button class="btn btn-dua btn-sm" type="button"
										onclick="ganti_status('<?= $data->id; ?>', 'confirm'); return false;">Confirm</button>

									<button class="btn btn-satu btn-sm" type="button"
										onclick="ganti_status('<?= $data->id; ?>','cancel'); return false;">Hapus</button>
								<?php } ?>

								<button class="btn btn-warning btn-sm btn-tiga" type="button"
									onclick='show("<?= $folder; ?>/cform/","#main"); return false;'>Kembali</button>

							<?php } else { ?>
								<button class="btn btn-success btn-sm btn-satu" type="submit" value="Simpan" name="simpan"
									id="submit">Update</button>
								<button class="btn btn-warning btn-sm btn-tiga" type="button"
									onclick='show("<?= $folder; ?>/cform/","#main"); return false;'>Kembali</button>
							<?php }
						} ?>
					</div>
				</div>
				</form>
				<!-- End Row -->
			</div>
		</div>

	</div>
</div>

<script>
	$("form").submit(function (event) {
		event.preventDefault();
		$("input").attr("disabled", true);
		$("select").attr("disabled", true);
		$("#submit").attr("disabled", true);
	});
	$(document).ready(function () {
		$('#id_product').select2({
			'placeholder': 'Select Product'
		});


	});
	function ganti_status(id, status) {

		let confirmButtonText = "Ya, hapus!";

		if (status == 'confirm') {
			confirmButtonText = "Ya, confirm!";
		}

		swal.fire({
			title: "Apakah anda yakin ?",
			text: "Anda tidak akan dapat memulihkan data ini!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: confirmButtonText,
			cancelButtonText: "Tidak, batalkan!",
		}).then((result) => {
			if (result.value) {
				$.ajax({
					type: "post",
					data: {
						'id': id,
						'status': status
					},
					url: "<?= base_url($folder . '/cform/ganti_status'); ?>",
					success: function (data) {
						swal.fire("Berhasil", "Data berhasil", "success");
						show('<?= $folder; ?>/cform/', '#main');
					},
					error: function () {
						swal.fire("Maaf", "Data gagal", "error");
					}
				});
			}
		});

	};
</script>