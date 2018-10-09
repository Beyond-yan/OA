package com.gdssoft.oa.service.hrm.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.hrm.EmpProfileDao;
import com.gdssoft.oa.model.hrm.EmpProfile;
import com.gdssoft.oa.service.hrm.EmpProfileService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class EmpProfileServiceImpl extends BaseServiceImpl<EmpProfile> implements EmpProfileService{
	private EmpProfileDao dao;
	
	public EmpProfileServiceImpl(EmpProfileDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public boolean checkProfileNo(String profileNo) {
		return dao.checkProfileNo(profileNo);
	}

}