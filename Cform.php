<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Cform extends CI_Controller
{

    public $global = array();
    public $id_menu = '10406';

    public function __construct()
    {
        parent::__construct();
        cek_session();

        $data = check_role($this->id_menu, 2);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->global['folder'] = $data[0]['nm_folder'];
        $this->global['title'] = $data[0]['nm_menu'];

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
            'data_product' => $this->mmaster->data_product(),
            // 'data_user' => $this->mmaster->data_user(),

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

        $this->form_validation->set_rules('id_product', 'id_product', 'trim|required');

        if ($this->form_validation->run() == false) {
            $data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $data);
        } else {
            $this->db->trans_begin();
            $id_product = $this->input->post('id_product');
            $username = $this->session->userdata('username');

            $this->mmaster->insert_header($id_product, $username);


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
                    'kode' => 'Berhasil',
                    'folder' => $this->global['folder'] . '/cform/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }

    public function edit()
    {

        $id_product = $this->uri->segment('4');
        $f_edit = $this->uri->segment('5');
        $f_acc = $this->uri->segment('6');

        if ($f_acc == "t") {
            $f_acc = true;
        } else {
            $f_acc = false;
        }

        if ($f_edit == 't') {
            $this->Logger->write('Membuka Menu Edit ' . $this->global['title'] . ' Kode :  ' . $id_product);
            $title = 'Edit ';
            $f_edit = true;
        } else {
            $this->Logger->write('Membuka Menu Data ' . $this->global['title']) . ' Kode : ' . $id_product;
            $title = 'Data ';
            $f_edit = false;
        }

        $data = array(
            'folder' => $this->global['folder'],
            'title' => $title . $this->global['title'],
            'title_list' => 'Daftar ' . $this->global['title'],
            'f_edit' => $f_edit,
            'f_acc' => $f_acc,
            'data' => $this->mmaster->data_header($id_product)->row(),
            'data_product' => $this->mmaster->data_product(),
        );

        $this->load->view($this->global['folder'] . '/vformedit', $data);
    }

    public function update()
    {
        $data = check_role($this->id_menu, 3);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->form_validation->set_rules('id_product', 'id_product', 'trim');
        $this->form_validation->set_rules('id', 'id', 'trim|required');
        $this->form_validation->set_rules('f_acc', 'f_acc', 'trim');

        if ($this->form_validation->run() == false) {
            $data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $data);
        } else {
            $this->db->trans_begin();
            $id = $this->input->post('id');
            $f_acc = $this->input->post('f_acc');

            if ($f_acc == 0) {
                $id_product = $this->input->post('id_product');
                $this->mmaster->update_header($id, $id_product);
            } else {
                $product_price_acc = str_replace(',', '', $this->input->post('product_price_acc'));
                $this->mmaster->update_price_acc($id, $product_price_acc);

                $status = 'SUCCESS';
                $this->mmaster->ganti_status($id, $status);

                $data_device = whatsapp_config();
                $device_id = $data_device['device_id'];
                $number = '6282226076210';
                $pesan = "";

                $data = $this->mmaster->data_header($id)->row();
    
                $kode_barang = $data->code_product;
                $nama_barang = $data->nm_product;
                $harga = number_format($data->product_price_req);
                $harga_acc = number_format($data->product_price_acc);
    
                $pesan .= "Permintaan Update Harga Anda\n";
                $pesan .= "Kode Barang: $kode_barang\n";
                $pesan .= "Nama Barang: $nama_barang\n";
                $pesan .= "Harga Request: USD $harga\n";
                $pesan .= "Harga Acc: USD $harga_acc\n";
                $pesan .= "Status: $status\n";

                $dataa = pesan_text($device_id, $number, $pesan);
                $data_insert_whatsapp_pending = [
                    'data' => json_encode($dataa),
                    'date' => current_datetime(),
                    'status' => 'Pending'
                ];

                $this->db->insert('m_whatsapp_message_pending', $data_insert_whatsapp_pending);
            }


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
                    'kode' => 'Berhasil',
                    'folder' => $this->global['folder'] . '/cform/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }


    public function ganti_status()
    {

        $data = check_role($this->id_menu, 3);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $id = $this->input->post("id");
        $status = $this->input->post("status");
        $status = strtoupper($status);

        if ($status == "CONFIRM") {
            $data_device = whatsapp_config();
            $device_id = $data_device['device_id'];
            $number = '6282226076210';
            $pesan = "";

            $data = $this->mmaster->data_header($id)->row();

            $kode_barang = $data->code_product;
            $nama_barang = $data->nm_product;
            $nm_users = $data->nm_users;
            // $product_price_req = $data->product_price_req;
            // $kurs_bank = pembulatan_kurs(kurs_usd());
            // $harga = number_format($product_price_req);
            // $estimasi = number_format(bulatkanKeAtas1JT($product_price_req * $kurs_bank));
            // $kurs_bank = number_format($kurs_bank);

            $pesan .= "*Permintaan Update Harga*\n";
            $pesan .= "Kode Barang: $kode_barang\n";
            $pesan .= "Nama Barang: $nama_barang\n";
            $pesan .= "Request: $nm_users\n\n";

            $pesan.= "*Silahkan buka EMMA web untuk update harga";

            $dataa = pesan_text($device_id, $number, $pesan);
            $data_insert_whatsapp_pending = [
                'data' => json_encode($dataa),
                'date' => current_datetime(),
                'status' => 'Pending'
            ];

            $this->db->insert('m_whatsapp_message_pending', $data_insert_whatsapp_pending);
            
            $this->mmaster->update_f_kirim($id, 9);
        }

        $this->mmaster->ganti_status($id, $status);

    }

}

/* End of file Cform.php */