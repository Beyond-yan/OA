package com.gdssoft.oa.dao.admin.impl;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.util.HashSet;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.dao.DataAccessException;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.ConfSummaryDao;
import com.gdssoft.oa.dao.admin.ConferenceDao;
import com.gdssoft.oa.dao.system.FileAttachDao;
import com.gdssoft.oa.model.admin.ConfSummary;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.system.FileAttach;

/**
 * @description confSummaryDaoImpl
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
@SuppressWarnings("unchecked")
public class ConfSummaryDaoImpl extends BaseDaoImpl<ConfSummary> implements
		ConfSummaryDao {
	@Resource
	private ConferenceDao confDao;
	@Resource
	private FileAttachDao fileAttachDao;

	public ConfSummaryDaoImpl() {
		super(ConfSummary.class);
	}

	/**
	 * @description 发送
	 */
	public ConfSummary send(ConfSummary cm, String fileIds) {
		return save(cm, fileIds);
	}

	/**
	 * @description 保存
	 */
	public ConfSummary save(ConfSummary cm, String fileIds) {
		if (fileIds != null && !fileIds.isEmpty()) {
			Set<FileAttach> set = new HashSet<FileAttach>();
			for (String s : fileIds.split(",")) {
				set.add(fileAttachDao.get(new Long(s)));
			}
			cm.setAttachFiles(set);
		}
		Conference cf = confDao.get(cm.getConfId().getConfId());
		cm.setConfId(cf);
		return super.save(cm);
	}

	//查询当前用户是否是管理员
	@Override
	public int searchUsr_Role(Long userId) {
		// TODO Auto-generated method stub
		String sql="select count(1) from user_role ur where ur.userid="+userId +" and ur.roleid=-1" ;

       int num=this.jdbcTemplate.queryForInt(sql);
		// jdbcConnection 
		return num;
	}

	@Override
	public int searchConfAt_Summary(Long userId, Long confId) {
		try {
			// TODO Auto-generated method stub
			String sql = "select count(1) from conf_attend ca where ca.userid= "
					+ userId + " and ca.confid=" + confId;
			int num = this.jdbcTemplate.queryForInt(sql);
			// jdbcConnection 
			return num;
		} catch (DataAccessException e) {
			// TODO: handle exception
			e.printStackTrace();
			return 0;
		}
	}
	
	

}