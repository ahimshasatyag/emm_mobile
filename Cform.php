<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Cform extends CI_Controller
{

    public $global = array();
    public $id_menu = '10801';

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

    public function view2()
    {
        $data = array(
            'folder' => $this->global['folder'],
            'title' => $this->global['title'],
            'data_suppliers' => $this->mmaster->data_suppliers(),
        );

        $this->Logger->write('Membuka Menu ' . $this->global['title']);

        $this->load->view($this->global['folder'] . '/vformlist2', $data);
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
            'mata_uangs' => $this->mmaster->mata_uangs()

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

        $this->form_validation->set_rules('nm_suppliers', 'nm_suppliers', 'trim|required');
        $this->form_validation->set_rules('suppliers_mobile', 'suppliers_mobile', 'trim');
        $this->form_validation->set_rules('suppliers_email', 'suppliers_email', 'trim');
        $this->form_validation->set_rules('suppliers_address', 'suppliers_address', 'trim');
        $this->form_validation->set_rules('suppliers_phone', 'suppliers_phone', 'trim');
        $this->form_validation->set_rules('suppliers_fax', 'suppliers_fax', 'trim');
        $this->form_validation->set_rules('suppliers_website', 'suppliers_website', 'trim');
        if ($this->form_validation->run() == false) {
            $data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $data);
        } else {
            $this->db->trans_begin();
            $id_suppliers = runningnumber('id_suppliers');
            $nm_suppliers = $this->input->post('nm_suppliers');
            $suppliers_mobile = $this->input->post('suppliers_mobile');
            $suppliers_email = $this->input->post('suppliers_email');
            $suppliers_address = $this->input->post('suppliers_address');
            $suppliers_phone = $this->input->post('suppliers_phone');
            $suppliers_fax = $this->input->post('suppliers_fax');
            $suppliers_website = $this->input->post('suppliers_website');
            $mata_uang = $this->input->post('mata_uang');

            $suppliers_logo = null;

            $this->load->library('upload');

            $config['upload_path'] = './assets/upload/'; //path folder
            $config['allowed_types'] = 'png|gif|jpg|jpeg|'; //type yang dapat diakses bisa anda sesuaikan
            $config['encrypt_name'] = true; //Enkripsi nama yang terupload
            $this->upload->initialize($config);

            if (!empty($_FILES['file']['name'])) {
                if ($this->upload->do_upload('file')) {
                    $gbr = $this->upload->data();
                    $suppliers_logo = $gbr['file_name'];
                }
            }

            $this->mmaster->insert($id_suppliers, $nm_suppliers, $suppliers_mobile, $suppliers_email,
                $suppliers_address, $suppliers_phone, $suppliers_fax, $suppliers_website, $suppliers_logo, $mata_uang);

            $jml = $this->input->post('jml');

            for ($i = 1; $i <= $jml; $i++) {
                $nm_suppliers_contact = $this->input->post('nm_suppliers_contact' . $i);
                $suppliers_contact_posisi = $this->input->post('suppliers_contact_posisi' . $i);
                $suppliers_contact_phone = $this->input->post('suppliers_contact_phone' . $i);
                $suppliers_contact_email = $this->input->post('suppliers_contact_email' . $i);

                if ($nm_suppliers_contact) {

                    $this->mmaster->insert_item($id_suppliers, $nm_suppliers_contact, $suppliers_contact_posisi, $suppliers_contact_phone,
                        $suppliers_contact_email);
                }
            }

            $this->Logger->write('Simpan Data ' . $this->global['title'] . ' Kode : ' . $id_suppliers);

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
                    'kode' => $id_suppliers,
                    'folder' => $this->global['folder'] . '/cform/edit/' . $id_suppliers . '/f/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }

    public function edit()
    {

        $id_suppliers = $this->uri->segment('4');
        $f_edit = $this->uri->segment('5');

        if ($f_edit == 't') {
            $this->Logger->write('Membuka Menu Edit ' . $this->global['title'] . ' Kode :  ' . $id_suppliers);
            $title = 'Edit ';
            $f_edit = true;
        } else {
            $this->Logger->write('Membuka Menu Data ' . $this->global['title']) . ' Kode : ' . $id_suppliers;
            $title = 'Data ';
            $f_edit = false;
        }

        $data = array(
            'folder' => $this->global['folder'],
            'title' => $title . $this->global['title'],
            'title_list' => 'Daftar ' . $this->global['title'],
            'f_edit' => $f_edit,
            'data' => $this->mmaster->data_header($id_suppliers)->row(),
            'data_item' => $this->mmaster->data_item($id_suppliers),
            'mata_uangs' => $this->mmaster->mata_uangs()
        );

        $this->load->view($this->global['folder'] . '/vformedit', $data);
    }

    public function update()
    {
        $data = check_role($this->id_menu, 3);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->form_validation->set_rules('id_suppliers', 'id_suppliers', 'trim|required');
        $this->form_validation->set_rules('nm_suppliers', 'nm_suppliers', 'trim|required');
        $this->form_validation->set_rules('suppliers_mobile', 'suppliers_mobile', 'trim');
        $this->form_validation->set_rules('suppliers_email', 'suppliers_email', 'trim');
        $this->form_validation->set_rules('suppliers_address', 'suppliers_address', 'trim');
        $this->form_validation->set_rules('suppliers_phone', 'suppliers_phone', 'trim');
        $this->form_validation->set_rules('suppliers_fax', 'suppliers_fax', 'trim');
        $this->form_validation->set_rules('suppliers_website', 'suppliers_website', 'trim');

        if ($this->form_validation->run() == false) {
            $data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $data);
        } else {
            $this->db->trans_begin();
            $id_suppliers = $this->input->post('id_suppliers');
            $nm_suppliers = $this->input->post('nm_suppliers');
            $suppliers_mobile = $this->input->post('suppliers_mobile');
            $suppliers_email = $this->input->post('suppliers_email');
            $suppliers_address = $this->input->post('suppliers_address');
            $suppliers_phone = $this->input->post('suppliers_phone');
            $suppliers_fax = $this->input->post('suppliers_fax');
            $suppliers_website = $this->input->post('suppliers_website');
            $mata_uang = $this->input->post('mata_uang');

            $suppliers_logo = null;

            $this->load->library('upload');

            $config['upload_path'] = './assets/upload/'; //path folder
            $config['allowed_types'] = 'png|gif|jpg|jpeg|'; //type yang dapat diakses bisa anda sesuaikan
            $config['encrypt_name'] = true; //Enkripsi nama yang terupload
            $this->upload->initialize($config);

            if (!empty($_FILES['file']['name'])) {
                if ($this->upload->do_upload('file')) {
                    $gbr = $this->upload->data();
                    $suppliers_logo = $gbr['file_name'];
                }
            }

            $this->mmaster->update($id_suppliers, $nm_suppliers, $suppliers_mobile, $suppliers_email,
                $suppliers_address, $suppliers_phone, $suppliers_fax, $suppliers_website, $suppliers_logo, $mata_uang);

            $jml = $this->input->post('jml');

            $this->mmaster->detele_item($id_suppliers);

            for ($i = 1; $i <= $jml; $i++) {
                $nm_suppliers_contact = $this->input->post('nm_suppliers_contact' . $i);
                $suppliers_contact_posisi = $this->input->post('suppliers_contact_posisi' . $i);
                $suppliers_contact_phone = $this->input->post('suppliers_contact_phone' . $i);
                $suppliers_contact_email = $this->input->post('suppliers_contact_email' . $i);

                if ($nm_suppliers_contact) {

                    $this->mmaster->insert_item($id_suppliers, $nm_suppliers_contact, $suppliers_contact_posisi, $suppliers_contact_phone,
                        $suppliers_contact_email);
                }
            }

            $this->Logger->write('Update Data ' . $this->global['title'] . ' Kode : ' . $id_suppliers);

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
                    'kode' => $id_suppliers,
                    'folder' => $this->global['folder'] . '/cform/edit/' . $id_suppliers . '/f/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }

    public function cari_supplier()
    {
        $id_suppliers = $this->input->post('id_suppliers');

        // $id_suppliers = $this->uri->segment('4');

        $data = array(
            'folder' => $this->global['folder'],
            'title' => "Tambah " . $this->global['title'],
            'title_list' => 'Daftar ' . $this->global['title'],
            'data_suppliers' => $this->mmaster->data_header($id_suppliers),
        );

        $this->load->view($this->global['folder'] . '/vformlist_search_supplier', $data);

    }

}

/* End of file Cform.php */