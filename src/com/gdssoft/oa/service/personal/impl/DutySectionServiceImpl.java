package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.personal.DutySectionDao;
import com.gdssoft.oa.model.personal.DutySection;
import com.gdssoft.oa.service.personal.DutySectionService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DutySectionServiceImpl extends BaseServiceImpl<DutySection> implements DutySectionService{
	private DutySectionDao dao;
	
	public DutySectionServiceImpl(DutySectionDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<DutySection> getAllDutySection() {
		// TODO Auto-generated method stub
		return dao.getAllDutySection();
	}

}