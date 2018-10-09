package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.admin.RegulationDao;
import com.gdssoft.oa.model.admin.Regulation;
import com.gdssoft.oa.service.admin.RegulationService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class RegulationServiceImpl extends BaseServiceImpl<Regulation> implements RegulationService{
	@SuppressWarnings("unused")
	private RegulationDao dao;
	
	public RegulationServiceImpl(RegulationDao dao) {
		super(dao);
		this.dao=dao;
	}

}