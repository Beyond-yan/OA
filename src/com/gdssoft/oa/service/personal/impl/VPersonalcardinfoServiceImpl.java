package com.gdssoft.oa.service.personal.impl;

import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.personal.VPersonalcardinfoDao;
import com.gdssoft.oa.model.personal.VPersonalcardinfo;
import com.gdssoft.oa.service.personal.VPersonalcardinfoService;

public class VPersonalcardinfoServiceImpl extends BaseServiceImpl<VPersonalcardinfo> implements
VPersonalcardinfoService {
	Log log = LogFactory.getLog("VPersonalcardinfoServiceImpl");	
	private VPersonalcardinfoDao dao;
	public VPersonalcardinfoServiceImpl(VPersonalcardinfoDao dao) {
		super(dao);
		this.dao = dao;
		// TODO Auto-generated constructor stub
	}
//	@Override
//	public List<VPersonalcardinfo> searchVPersonalcardinfoList(Date form,
//			Date to) {
//		// TODO Auto-generated method stub
//		return dao.searchVPersonalcardinfoList(form, to);
//	}
}
