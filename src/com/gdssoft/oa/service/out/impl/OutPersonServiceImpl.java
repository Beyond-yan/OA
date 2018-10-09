package com.gdssoft.oa.service.out.impl;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.out.OutPersonDao;
import com.gdssoft.oa.model.out.OutPerson;
import com.gdssoft.oa.service.out.OutPersonService;

public class OutPersonServiceImpl extends BaseServiceImpl<OutPerson> implements
		OutPersonService {
	private OutPersonDao outPersonDao;

	public OutPersonServiceImpl(OutPersonDao dao) {
		super(dao);
		this.outPersonDao = dao;
	}

	@Override
	public List<OutPerson> find(int deleted, String fullname, String depName,Date sdt, Date edt, int size, int start) {
		return outPersonDao.find(deleted, fullname, depName, sdt, edt, size, start);}
	
	public Long count(int deleted,String fullname,String depName,Date sdt,Date edt){
		return outPersonDao.count(deleted, fullname, depName, sdt, edt);
	}
	
	
}
