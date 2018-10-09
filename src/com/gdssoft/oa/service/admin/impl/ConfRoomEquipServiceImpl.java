package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.ConfRoomEquipDao;
import com.gdssoft.oa.model.admin.ConfRoomEquip;
import com.gdssoft.oa.service.admin.ConfRoomEquipService;

public class ConfRoomEquipServiceImpl extends BaseServiceImpl<ConfRoomEquip> implements ConfRoomEquipService{
	@SuppressWarnings("unused")
	private ConfRoomEquipDao dao;
	
	public ConfRoomEquipServiceImpl(ConfRoomEquipDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public void delete(Long roomId){
		dao.delete(roomId);
	}

}