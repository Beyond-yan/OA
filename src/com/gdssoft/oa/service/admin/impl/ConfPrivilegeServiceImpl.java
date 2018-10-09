package com.gdssoft.oa.service.admin.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import com.gdssoft.oa.dao.admin.ConfPrivilegeDao;
import com.gdssoft.oa.model.admin.ConfPrivilege;
import com.gdssoft.oa.service.admin.ConfPrivilegeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;

/**
 * @description ConfPrivilegeServiceImpl
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public class ConfPrivilegeServiceImpl extends BaseServiceImpl<ConfPrivilege>
		implements ConfPrivilegeService {
	private ConfPrivilegeDao dao;

	public ConfPrivilegeServiceImpl(ConfPrivilegeDao dao) {
		super(dao);
		this.dao = dao;
	}

	/**
	 * @description 获取该数据的权限
	 * @param confId
	 *            confId
	 * @param s
	 *            1=查看,2=修改,3=建立纪要
	 * @return 0.没有权限,1.查看，2.修改，3.创建
	 */
	@Override
	public Short getPrivilege(Long confId, Short s) {
		return dao.getPrivilege(ContextUtil.getCurrentUserId(), confId, s);
	}

}