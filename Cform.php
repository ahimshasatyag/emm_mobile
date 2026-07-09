<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Cform extends CI_Controller
{

	public $global = array();
	public $id_menu = '10802';

	public function __construct()
	{
		parent::__construct();
		cek_session();

		$data = check_role($this->id_menu, 2);
		if (!$data) {
			redirect(base_url(), 'refresh');
		}

		$this->global['folder'] = $data[0]['nm_folder'];
		$this->global['title'] = "Purchase Quotations";

		$this->load->model($this->global['folder'] . '/mmaster');
	}

	public function index()
	{
		$data = array(
			'folder' => $this->global['folder'],
			'title' => $this->global['title'],
		);

		$this->Logger->write('Membuka Menu ' . $this->global['title']);

		$this->load->view($this->global['folder'] . '/vformlist', $data);
	}

	public function data()
	{
		echo $this->mmaster->data($this->id_menu, $this->global['folder']);
	}

	public function tambah()
	{

		$data = check_role($this->id_menu, 1);
		if (!$data) {
			redirect(base_url(), 'refresh');
		}

		$data = array(
			'folder' => $this->global['folder'],
			'title' => "Tambah " . $this->global['title'],
			'title_list' => 'Daftar ' . $this->global['title'],
			'data_supplier' => $this->mmaster->data_supplier(),
			'data_gudang' => $this->mmaster->data_gudang(),
			'data_product' => $this->mmaster->data_product(),
			'mata_uangs' => $this->mmaster->mata_uangs(),
			'data_lokasi' => $this->mmaster->data_lokasi(),
		);

		$this->Logger->write('Membuka Menu Tambah ' . $this->global['title']);

		$this->load->view($this->global['folder'] . '/vformadd', $data);
	}


	public function simpan()
	{

		$data = check_role($this->id_menu, 1);
		if (!$data) {
			redirect(base_url(), 'refresh');
		}

		$this->form_validation->set_rules('id_suppliers', 'id_suppliers', 'trim|required');
		$this->form_validation->set_rules('id_gudang', 'id_gudang', 'trim|required');
		$this->form_validation->set_rules('date_po', 'date_po', 'trim');
		$this->form_validation->set_rules('date_schdl', 'date_schdl', 'trim');

		if ($this->form_validation->run() == false) {
			$data = array(
				'sukses' => false,
			);
			$this->load->view('pesan', $data);
		} else {

			$this->db->trans_begin();
			$id_suppliers = $this->input->post('id_suppliers');
			$nm_suppliers = $this->input->post('nm_suppliers');
			$id_gudang = $this->input->post('id_gudang');
			$mata_uang = $this->input->post('mata_uang');
			$date_po = date("Y-m-d", strtotime($this->input->post('date_po')));
			$date_schdl = $this->input->post('date_schdl');

			if (!$date_schdl) {
				$date_schdl = null;
			} else {
				$date_schdl = date("Y-m-d", strtotime($date_schdl));
			}

			$periode = date("Ym", strtotime($this->input->post('date_po')));
			$code_po = runningnumber_tahun('QAP', $periode);
			$status_po = "DRAFT";

			$partner_ref = $this->input->post('partner_ref');
			$notes = $this->input->post('notes');
			$id_product_lokasi = $this->input->post('id_product_lokasi');


			$id_po = $this->mmaster->simpan_po_hdr($code_po, $date_po, $status_po, $date_schdl, $id_suppliers, $nm_suppliers, $id_gudang, $mata_uang, $partner_ref, $notes, $id_product_lokasi);

			$amount_total = 0;

			$jml = $this->input->post('jml');

			if ($jml) {
				for ($i = 1; $i <= $jml; $i++) {
			
					$id_product = $this->input->post('id_product' . $i);
					$code_product = $this->input->post('code_product' . $i);
					$nm_product = $this->input->post('nm_product' . $i);
					$product_deskripsi = $this->input->post('product_deskripsi' . $i);
			
					if ($id_product) {
						$notes = $this->input->post('notes' . $i);
						$product_price = str_replace(',', '', $this->input->post('product_price' . $i));
						$qty = str_replace(',', '', $this->input->post('nqty' . $i));
						$check_data_qty = $this->mmaster->check_qty_dtl($id_po, $id_product);
			
						$amount_total = $amount_total + ($product_price * $qty);
			
						if ($check_data_qty->num_rows() == 0) {
							if ($qty > 0) {
								$id_po_dtl = $this->mmaster->simpan_po_dtl($id_po, $id_product, $code_product, $nm_product, $product_deskripsi, $qty, $product_price, $notes);
							}
						} else {
							if ($qty > 0) {
								$id_po_dtl = $check_data_qty->row()->id_po_dtl;
								$this->mmaster->update_po_dtl($id_po_dtl, $qty, $id_product);
							}
						}
			
						// Tabel Options
						$options = $this->input->post('options' . $i); 
						$nm_product_opt_array = $this->input->post('nm_product_opt' . $i); 
						$harga_opt_array = $this->input->post('harga' . $i); 
			
						// Cek jika ada selected options
						if (!empty($options) && is_array($options)) {
							foreach ($options as $key => $id_product) {
								// Validasi dan sanitasi data opsi produk
								$nm_product_opt = isset($nm_product_opt_array[$key]) ? $nm_product_opt_array[$key] : null;
								$harga_raw = isset($harga_opt_array[$key]) ? $harga_opt_array[$key] : null;
			
								if (!empty($nm_product_opt) && isset($harga_raw)) {
									$harga = str_replace(',', '', $harga_raw); // Menghapus koma dalam harga
									if (is_numeric($harga)) {
										// Pastikan opsi produk dan harga valid
										$this->mmaster->simpan_po_opt_dtl($id_po_dtl, $id_product, $id_po, $nm_product_opt, $harga);
									}
								}
							}
						}
			
					}
				}
			}
			

			$this->mmaster->update_amount_total($id_po, $amount_total);



			$this->Logger->write('Simpan Data ' . $this->global['title'] . ' Kode : ' . $id_po);

			if ($this->db->trans_status() === false) {
				$this->db->trans_rollback();
				$data = array(
					'sukses' => false,
				);
				$this->load->view('pesan', $data);
			} else {
				$this->db->trans_commit();
				$data = array(
					'sukses' => true,
					'kode' => $code_po,
					'folder' => $this->global['folder'] . '/cform/edit/' . $id_po . '/f/',
				);
				$this->load->view('pesan', $data);
			}
		}
	}


	public function edit()
	{

		$id_po = $this->uri->segment('4');
		$f_edit = $this->uri->segment('5');

		if ($f_edit == 't') {
			$this->Logger->write('Membuka Menu Edit ' . $this->global['title'] . ' Kode :  ' . $id_po);
			$title = 'Edit ';
			$f_edit = true;
		} else {
			$this->Logger->write('Membuka Menu Data ' . $this->global['title']) . ' Kode : ' . $id_po;
			$title = 'Data ';
			$f_edit = false;
		}

		$data = array(
			'folder' => $this->global['folder'],
			'title' => $title . $this->global['title'],
			'title_list' => $title . $this->global['title'],
			'data_supplier' => $this->mmaster->data_supplier(),
			'data_gudang' => $this->mmaster->data_gudang(),
			'data_product' => $this->mmaster->data_product(),
			'data' => $this->mmaster->data_header($id_po)->row(),
			'f_edit' => $f_edit,
			'data_detail' => $this->mmaster->data_detail($id_po),
			'mata_uangs' => $this->mmaster->mata_uangs(),
			'data_lokasi' => $this->mmaster->data_lokasi(),
		);

		$this->Logger->write('Membuka Menu Edit ' . $this->global['title']) . ' Kode : ' . $id_po;

		// if ($this->session->userdata('id_users_level') == 15) {
		// 	$this->load->view($this->global['folder'] . '/vformeditsupplier', $data);
		// } else {
		// }

		if ($f_edit) {
			$this->load->view($this->global['folder'] . '/vformedit', $data);
		} else {
			$this->load->view($this->global['folder'] . '/vformedit_view', $data);
		}
	}


	public function update()
	{

		$data = check_role($this->id_menu, 3);
		if (!$data) {
			redirect(base_url(), 'refresh');
		}

		$this->form_validation->set_rules('id_po', 'id_po', 'trim|required');
		$this->form_validation->set_rules('code_po', 'code_po', 'trim|required');
		$this->form_validation->set_rules('id_suppliers', 'id_suppliers', 'trim|required');
		$this->form_validation->set_rules('id_gudang', 'id_gudang', 'trim|required');
		$this->form_validation->set_rules('date_po', 'date_po', 'trim');
		$this->form_validation->set_rules('date_schdl', 'date_schdl', 'trim');

		if ($this->form_validation->run() == false) {
			$data = array(
				'sukses' => false,
			);
			$this->load->view('pesan', $data);
		} else {

			$this->db->trans_begin();
			$id_po = $this->input->post('id_po');
			$code_po = $this->input->post('code_po');
			$id_suppliers = $this->input->post('id_suppliers');
			$nm_suppliers = $this->input->post('nm_suppliers');
			$id_gudang = $this->input->post('id_gudang');
			$mata_uang = $this->input->post('mata_uang');
			$date_po = date("Y-m-d", strtotime($this->input->post('date_po')));
			$date_schdl = $this->input->post('date_schdl');

			if (!$date_schdl) {
				$date_schdl = null;
			} else {
				$date_schdl = date("Y-m-d", strtotime($date_schdl));
			}


			$partner_ref = $this->input->post('partner_ref');
			$notes = $this->input->post('notes');
			$id_product_lokasi = $this->input->post('id_product_lokasi');

			$link_file = null;

			$this->load->library('upload');
			$this->db->trans_begin();
			$config['upload_path'] = './assets/upload/';
			$config['allowed_types'] = 'pdf|docx|doc|jpg|png|jpeg';
			$config['encrypt_name'] = true;
			$this->upload->initialize($config);

			if (!empty($_FILES['link_file']['name'])) {
				if ($this->upload->do_upload('link_file')) {

					$gbr = $this->upload->data();
					$link_file = $gbr['file_name'];

					$data_po = $this->mmaster->data_header($id_po)->row();

					if (($data_po->link_file != null) || ($data_po->link_file != '')) {
						unlink('./assets/upload/' . $data_po->link_file);
					}
				}
			}

			$this->mmaster->update_po_hdr($id_po, $date_po, $date_schdl, $id_suppliers, $nm_suppliers, $id_gudang, $mata_uang, $partner_ref, $notes, $id_product_lokasi, $link_file);

			$this->mmaster->delete_po_dtl($id_po);
			$jml = $this->input->post('jml');

			$amount_total = 0;

			if ($jml) {
				for ($i = 1; $i <= $jml; $i++) {
			
					$id_product = $this->input->post('id_product' . $i);
					$code_product = $this->input->post('code_product' . $i);
					$nm_product = $this->input->post('nm_product' . $i);
					$product_deskripsi = $this->input->post('product_deskripsi' . $i);
					if ($id_product) {
						$notes = $this->input->post('notes' . $i);
						$product_price = str_replace(',', '', $this->input->post('product_price' . $i));
						$qty = str_replace(',', '', $this->input->post('nqty' . $i));
						$check_data_qty = $this->mmaster->check_qty_dtl($id_po, $id_product);
			
						$amount_total = $amount_total + ($product_price * $qty);
			
						if ($check_data_qty->num_rows() == 0) {
							if ($qty > 0) {
								$id_po_dtl = $this->mmaster->simpan_po_dtl($id_po, $id_product, $code_product, $nm_product, $product_deskripsi, $qty, $product_price, $notes);
							}
						} else {
							if ($qty > 0) {
								$id_po_dtl = $check_data_qty->row()->id_po_dtl;
								$this->mmaster->update_po_dtl($id_po_dtl, $qty, $id_product);
							}
						}
			
						// Proses Data Options
						$this->db->trans_begin();
			
						$id_po_dtl_array = $this->input->post('id_po_dtl');
						$id_product_array = $this->input->post('id_product');
						$options = $this->input->post('options');
			
						if (!empty($id_po_dtl_array) && is_array($id_po_dtl_array)) {
							foreach ($id_po_dtl_array as $no => $id_po_dtl) {
								$id_product = $id_product_array[$no] ?? null;
			
								$this->mmaster->delete_po_opt_dtl($id_po_dtl);
			
								if (isset($options[$no]) && is_array($options[$no])) {
									foreach ($options[$no] as $id_po => $opt_data) {
										if (isset($opt_data['checked'])) {
											$nm_product_opt = $opt_data['nm_product_opt'] ?? null;
											$harga_raw = $opt_data['harga'] ?? null;
			
											if (!empty($nm_product_opt) && isset($harga_raw)) {
												$harga = str_replace(',', '', $harga_raw);
			
												if (is_numeric($harga)) {
														$this->mmaster->update_po_opt_dtl($id_po_dtl, $id_product, $id_po, $nm_product_opt, $harga);
												} else {
														$this->mmaster->simpan_po_opt_dtl($id_po_dtl, $id_product, $id_po, $nm_product_opt, $harga);
													
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			

			$this->mmaster->update_amount_total($id_po, $amount_total);


			$this->Logger->write('Update Data ' . $this->global['title'] . ' Kode : ' . $id_po);

			if ($this->db->trans_status() === false) {
				$this->db->trans_rollback();
				$data = array(
					'sukses' => false,
				);
				$this->load->view('pesan', $data);
			} else {
				$this->db->trans_commit();
				$data = array(
					'sukses' => true,
					'kode' => $code_po,
					'folder' => $this->global['folder'] . '/cform/edit/' . $id_po . '/f/',
				);
				$this->load->view('pesan', $data);
			}
		}
	}


	public function confirm()
	{
		$id_po = $this->input->post("id_po");

		$data_header = $this->mmaster->data_header($id_po)->row();

		$code_po_lama = $data_header->code_po;

		$id_product_lokasi_source = 8;
		
		$id_product_lokasi_destination = $data_header->id_product_lokasi;

		$code_po = runningnumber_tahun('PO', date('Ym'));

		$this->mmaster->update_code_po($id_po, $code_po_lama, $code_po);

		$status_po = "PO PURCHASE";
		$this->mmaster->ganti_status_hdr($id_po, $status_po);


		$data_barang = $this->mmaster->data_detail($id_po);

		$periode = date('Ym');
		$code_incoming = runningnumber_tahun_angka('IN', $periode);

		$id_suppliers = $data_header->id_suppliers;
		$status_incoming = 'READY TO RECEIVE';

		$id_incoming = $this->mmaster->insert_header_incoming($code_incoming, $id_po, $id_suppliers, $status_incoming);

		if ($data_barang->num_rows() > 0) {
			foreach ($data_barang->result() as $row) {
				$id_product = $row->id_product;
				$qty = $row->qty;
				for ($i = 1; $i <= $qty; $i++) {
					$this->mmaster->insert_detail_incoming($id_incoming, $id_product, 1, $id_product_lokasi_source, $id_product_lokasi_destination);
				}
			}
		}


		echo json_encode(array('status' => true));
	}

	public function get_mata_uang_default()
	{
		$id_supplier = $this->input->post('id_supplier');

		$data = $this->db->query("select a.id_mata_uang from m_suppliers a where a.id_suppliers = '$id_supplier'")->row();

		echo json_encode($data);
	}

	public function get_product_detail()
	{
		$id_product = $this->input->post('id_product');
	
		// Query untuk mendapatkan detail produk utama (1 baris)
		$data = $this->db->query("select
			a.nm_product,
			a.product_deskripsi,
			b.nm_product_satuan,
			d.nm_product_opt
		from
			m_product a
		inner join m_product_satuan b on
			a.id_product_satuan = b.id_product_satuan
		left join tb_po_opt_dtl c on
			c.id_product = a.id_product
		left join m_product_price_opt d on
			d.id_product = a.id_product
		left join tb_po_hdr e on
			e.id_po = c.id_po
		left join tb_po_dtl f on
			f.id_po_dtl = c.id_po_dtl
		where
			a.id_product = $id_product")->row();
	
		$options = $this->db->query("SELECT 
			nm_product_opt
			FROM m_product_price_opt 
			WHERE id_product = $id_product")->result();

		$data->options = $options;
	
		echo json_encode($data);
	}

	public function cancel(){
		$id_po = $this->input->post("id_po");

		$status_po = "CANCEL";
		$this->mmaster->ganti_status_hdr($id_po, $status_po);

		echo json_encode(array('status' => true));
	}

	public function get_lokasi(){
		$id_gudang = $this->input->post('id_gudang');

		$data = $this->db->query("select * from m_product_lokasi where id_gudang = '$id_gudang'");

		echo json_encode($data->result());
	}
}

/* End of file Cform.php */