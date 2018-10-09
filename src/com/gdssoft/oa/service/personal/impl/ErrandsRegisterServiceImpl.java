package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.personal.ErrandsRegisterDao;
import com.gdssoft.oa.model.personal.ErrandsRegister;
import com.gdssoft.oa.service.personal.ErrandsRegisterService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ErrandsRegisterServiceImpl extends BaseServiceImpl<ErrandsRegister> implements ErrandsRegisterService{
	private ErrandsRegisterDao dao;
	
	public ErrandsRegisterServiceImpl(ErrandsRegisterDao dao) {
		super(dao);
		this.dao=dao;
	}

}