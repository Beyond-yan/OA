package com.gdssoft.oa.service.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import com.gdssoft.oa.model.admin.ConfPrivilege;
import com.gdssoft.core.service.BaseService;

/**
 * @description ConfPrivilegeService
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public interface ConfPrivilegeService extends BaseService<ConfPrivilege> {

	/**
	 * @description 获取该数据的权限
	 * @param confId
	 *            confId
	 * @param s
	 *            1=查看,2=修改,3=建立纪要
	 * @return 0.没有权限,1.查看，2.修改，3.创建
	 */
	Short getPrivilege(Long confId, Short s);
}
