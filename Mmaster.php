<?php

defined('BASEPATH') or exit('No direct script access allowed');
use Ozdemir\Datatables\Datatables;
use Ozdemir\Datatables\DB\CodeigniterAdapter;

class Mmaster extends CI_Model
{
    public function data($i_menu, $folder)
    {
        $datatables = new Datatables(new CodeigniterAdapter);
        $datatables->query("select id_suppliers, nm_suppliers, suppliers_address, '0' as qty,  '$folder' as folder
        from m_suppliers ");
        $datatables->hide('folder');
        $datatables->hide('id_suppliers');

        $datatables->edit('nm_suppliers', function ($data) {
            $id_suppliers = $data['id_suppliers'];
            $nm_suppliers = $data['nm_suppliers'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id_suppliers/f\",\"#main\"); return false;'>$nm_suppliers</a>";
            return $hasil;
        });

        return $datatables->generate();
    }

    public function insert($id_suppliers, $nm_suppliers, $suppliers_mobile, $suppliers_email,
        $suppliers_address, $suppliers_phone, $suppliers_fax, $suppliers_website, $suppliers_logo, $mata_uang) {

        $data = array(
            'id_suppliers' => $id_suppliers,
            'nm_suppliers' => $nm_suppliers,
            'suppliers_mobile' => $suppliers_mobile,
            'suppliers_email' => $suppliers_email,
            'suppliers_address' => $suppliers_address,
            'suppliers_phone' => $suppliers_phone,
            'suppliers_fax' => $suppliers_fax,
            'suppliers_website' => $suppliers_website,
            'suppliers_logo' => $suppliers_logo,
            'date_create' => current_datetime(),
            'id_mata_uang' => $mata_uang
        );

        $this->db->insert('m_suppliers', $data);

    }

    public function insert_item($id_suppliers, $nm_suppliers_contact, $suppliers_contact_posisi, $suppliers_contact_phone,
        $suppliers_contact_email) {
        $data = array(
            'id_suppliers' => $id_suppliers,
            'nm_suppliers_contact' => $nm_suppliers_contact,
            'suppliers_contact_posisi' => $suppliers_contact_posisi,
            'suppliers_contact_phone' => $suppliers_contact_phone,
            'suppliers_contact_email' => $suppliers_contact_email,
        );

        $this->db->insert('m_suppliers_contact', $data);
    }

    public function update($id_suppliers, $nm_suppliers, $suppliers_mobile, $suppliers_email,
        $suppliers_address, $suppliers_phone, $suppliers_fax, $suppliers_website, $suppliers_logo, $mata_uang) {

        if ($suppliers_logo == null) {

            $data = array(
                'nm_suppliers' => $nm_suppliers,
                'suppliers_mobile' => $suppliers_mobile,
                'suppliers_email' => $suppliers_email,
                'suppliers_address' => $suppliers_address,
                'suppliers_phone' => $suppliers_phone,
                'suppliers_fax' => $suppliers_fax,
                'suppliers_website' => $suppliers_website,
                'date_update' => current_datetime(),
                'id_mata_uang' => $mata_uang
            );
        } else {
            $data = array(
                'nm_suppliers' => $nm_suppliers,
                'suppliers_mobile' => $suppliers_mobile,
                'suppliers_email' => $suppliers_email,
                'suppliers_address' => $suppliers_address,
                'suppliers_phone' => $suppliers_phone,
                'suppliers_fax' => $suppliers_fax,
                'suppliers_website' => $suppliers_website,
                'suppliers_logo' => $suppliers_logo,
                'date_update' => current_datetime(),
                'id_mata_uang' => $mata_uang
            );
        }

        $this->db->where('id_suppliers', $id_suppliers);
        $this->db->update('m_suppliers', $data);

    }

    public function detele_item($id_suppliers)
    {
        $this->db->where('id_suppliers', $id_suppliers);
        $this->db->delete('m_suppliers_contact');
    }

    public function data_header($id_suppliers)
    {
        return $this->db->query("select * from m_suppliers where id_suppliers = '$id_suppliers'");
    }

    public function data_item($id_suppliers)
    {
        return $this->db->query("select * from m_suppliers_contact where id_suppliers = '$id_suppliers'");
    }

    public function data_suppliers()
    {
        return $this->db->get('m_suppliers');
    }

    public function mata_uangs(){
        return $this->db->get('m_mata_uang');
    }

}

/* End of file Mmaster.php */