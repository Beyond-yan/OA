package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.personal.HolidayRecordDao;
import com.gdssoft.oa.model.personal.HolidayRecord;
import com.gdssoft.oa.service.personal.HolidayRecordService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class HolidayRecordServiceImpl extends BaseServiceImpl<HolidayRecord> implements HolidayRecordService{
	private HolidayRecordDao dao;
	
	public HolidayRecordServiceImpl(HolidayRecordDao dao) {
		super(dao);
		this.dao=dao;
	}

}