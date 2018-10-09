package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.oa.dao.system.UserSubDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.UserSub;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class UserSubDaoImpl extends BaseDaoImpl<UserSub> implements UserSubDao{

	public UserSubDaoImpl() {
		super(UserSub.class);
	}

	@Override
	public List<Long> upUser(Long userId) {
		String hql="from UserSub vo where vo.subAppUser.userId=?";
		Object[] objs={userId};
		List<UserSub> list=findByHql(hql, objs);
		List<Long> idList=new ArrayList<Long>();
		for(UserSub sb:list){
			idList.add(sb.getUserId());
		}
		return idList;
	}

	@Override
	public List<Long> subUsers(Long userId) {
		String hql="from UserSub vo where vo.userId=?";
		Object[] objs={userId};
		List<UserSub> list=findByHql(hql, objs);
		List<Long> idList=new ArrayList<Long>();
		for(UserSub sb:list){
			idList.add(sb.getSubAppUser().getUserId());
		}
		return idList;
	}

	@Override
	public List<UserSub> findByUser(Long userId) {
		String hql="from UserSub vo where vo.userId=? ";
		Object[] objs={userId};
		return findByHql(hql, objs);
	}

}