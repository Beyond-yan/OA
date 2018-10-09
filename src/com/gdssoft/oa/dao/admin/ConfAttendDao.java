package com.gdssoft.oa.dao.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;

import com.gdssoft.oa.model.admin.ConfAttend;
import com.gdssoft.core.dao.BaseDao;

/**
 * @description ConfAttendDao
 * @author YHZ
 * @data 2010-10-8 PM
 * 
 */
public interface ConfAttendDao extends BaseDao<ConfAttend> {
	
	public List<ConfAttend> getConfAt(Long confID);
	
	public void delete(Long confId);

}