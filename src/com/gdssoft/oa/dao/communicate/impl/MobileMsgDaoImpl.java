package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.communicate.MobileMsgDao;
import com.gdssoft.oa.model.communicate.MobileMsg;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class MobileMsgDaoImpl extends BaseDaoImpl<MobileMsg> implements MobileMsgDao{

	public MobileMsgDaoImpl() {
		super(MobileMsg.class);
	}

}