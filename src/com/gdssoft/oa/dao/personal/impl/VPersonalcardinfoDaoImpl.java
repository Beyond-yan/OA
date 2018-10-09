package com.gdssoft.oa.dao.personal.impl;



import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.personal.VPersonalcardinfoDao;
import com.gdssoft.oa.model.personal.VPersonalcardinfo;

public class VPersonalcardinfoDaoImpl extends BaseDaoImpl<VPersonalcardinfo> implements
VPersonalcardinfoDao {	
	Log log = LogFactory.getLog("ProcessReportDaoImpl");
	public VPersonalcardinfoDaoImpl() {
		super(VPersonalcardinfo.class);
		// TODO Auto-generated constructor stub
	}
//	@Override
//	public List<VPersonalcardinfo> searchVPersonalcardinfoList(Date form,
//			Date to) {
//		// TODO Auto-generated method stub
//		String sql="select * from V_PersonalCardinfo v where v.usetime >= " +form 
//				+" and v.usetime<= "+to;
//		List<VPersonalcardinfo> list=null;
//        list=jdbcTemplate.queryForList(sql);
//		return list;
//	}
}
