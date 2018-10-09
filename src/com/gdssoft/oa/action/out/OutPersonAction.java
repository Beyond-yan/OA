package com.gdssoft.oa.action.out;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.out.OutPerson;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.out.OutPersonService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.SysConfigService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class OutPersonAction extends BaseAction {

	@Resource
	private OutPersonService outPersonService;
	@Resource
	private DepartmentService departmentservice;
	@Resource
	private AppUserService appuserService;
	@Resource
	private MailEngine mailEngine;
	private OutPerson outPerson;
	private Long Id;
	@Resource
	private SysConfigService sysConfigService;
	/**
	 * 获得列表信息
	 * 
	 * @return
	 */
	public String list() {
		Date sdt = null;
		Date edt = null;
		String depName = "";
		if (getRequest().getParameter("Q_depName_S_LK") != null
				&& !"".equals(getRequest().getParameter("Q_depName_S_LK"))) {
			depName = getRequest().getParameter("Q_depName_S_LK");
		}
		int deleted = 9;
		if (getRequest().getParameter("Q_deleted_S_EQ") != null
				&& !"".equals(getRequest().getParameter("Q_deleted_S_EQ"))) {
			deleted = Integer.parseInt(getRequest().getParameter(
					"Q_deleted_S_EQ"));
		}
		String fullname = getRequest().getParameter("Q_appUser.fullname_S_LK");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("enddate");
		if (startDate != null && !"".equals(startDate)) {
			try {
				sdt = sdf.parse(startDate+" 00:00:00");
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				edt = sdf.parse(endDate+" 23:59:59");
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		List<OutPerson> list = outPersonService.find(deleted, fullname,
				depName, sdt, edt, size, start);
		Long con = outPersonService.count(deleted, fullname, depName, sdt, edt);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(con).append(",result:");
		;
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate",
				"updateDate");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "startDate");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "endDate");
		buff.append(json.exclude(new String[] { "class", "appUser.password" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 保存
	 * 
	 * @return
	 */
	public String save() {
		String comment=getRequest().getParameter("comment");
		String userId = getRequest().getParameter("outPerson.appUser.userId");
		AppUser appuser=appuserService.get(Long.valueOf(userId));
		boolean res = true;
		if (outPerson.getId() == null) {
			String sd = getRequest().getParameter("outPerson.startDate");
			sd += ":00:00";
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			try {
				outPerson.setStartDate(sdf.parse(sd));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String ed = getRequest().getParameter("outPerson.endDate");
			ed += ":00:00";
			try {
				outPerson.setEndDate(sdf.parse(ed));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			outPerson.setCreateDate(new Date());
			outPerson.setCreateUser(ContextUtil.getCurrentUser().getFullname());
			//outPerson.getAppUser().getUserId();
			outPerson.setDeleted("0");
			outPersonService.save(outPerson);
		} else {
			OutPerson leader = outPersonService.get(outPerson.getId());
			try {
				String sd = getRequest().getParameter("outPerson.startDate");
				sd += ":00:00";
				SimpleDateFormat sdf = new SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss");
				try {
					outPerson.setStartDate(sdf.parse(sd));
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				String ed = getRequest().getParameter("outPerson.endDate");
				ed += ":00:00";
				try {
					outPerson.setEndDate(sdf.parse(ed));
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				BeanUtil.copyNotNullProperties(leader, outPerson);
				leader.setUpdateDate(new Date());
				leader.setUpdateUser(ContextUtil.getCurrentUser()
						.getFullname());
				outPersonService.save(leader);
			} catch (Exception ex) {
				res = false;
				ex.printStackTrace();
			}
		}
		email(appuser,comment);
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}
	/**
	 * 发送邮件
	 * 
	 * @return
	 */
	private String email(AppUser appUser, String comment) {
		SysConfig officeDeputyDirectorRoleID = sysConfigService.findByKey("officeDeputyDirectorRoleID");
		SysConfig officeDirectorRoleID = sysConfigService.findByKey("officeDirectorRoleID");
		SimpleDateFormat sdfmail = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		Date curDate = new Date();
		//判断是否是处长非处长
		Set<AppRole> roles = appUser.getRoles();
		String curDateStr = sdfmail.format(curDate);
		boolean isofficeDeputyDirector = false;
		for (AppRole role : roles) {
			if ((role.getRoleId().toString().equals(officeDeputyDirectorRoleID
					.getDataValue())||role.getRoleId().toString().equals(officeDirectorRoleID
							.getDataValue())))
				isofficeDeputyDirector = true;
			}
		// 发送邮件
		long parentId = appUser.getDepartment().getParentId();
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_parentId_L_EQ", Long.toString(parentId));
	    List<Department> list=departmentservice.getAll(filter);
		for(Department dp:list){
			QueryFilter filter2 = new QueryFilter(getRequest());
			filter2.addFilter("Q_department.depId_L_EQ", Long.toString(dp.getDepId()));
			 List<AppUser> list2=appuserService.getAll(filter2);
			 for(AppUser au:list2){
					if (isofficeDeputyDirector){
						if (au.getEmail() != null) {
							if (logger.isDebugEnabled()) {
								logger.info("Notice " + au.getFullname() + " by mail:"
										+ au.getEmail());
							}
							String tempPath = "mail/mailNotice.vm";
							Map model = new HashMap();
							model.put("curDateStr", curDateStr);
							String subject = comment;
							System.out.println("---subject---"+subject);
							mailEngine.sendTemplateMail(tempPath, model, subject, null,
									new String[] { au.getEmail() }, null, null, null,
									null, true);

						}
					}
			 }
		}

		
		
		jsonString = "{success:true}";
		return SUCCESS;
	}
	/**
	 * 判断是否是处长和副处长
	 * 
	 * @return
	 */
	public String isofficeDeputyDirector() {
		SysConfig officeDeputyDirectorRoleID = sysConfigService.findByKey("officeDeputyDirectorRoleID");
		SysConfig officeDirectorRoleID = sysConfigService.findByKey("officeDirectorRoleID");
		String userId = getRequest().getParameter("outPerson.appUser.userId");
		//判断是否是处长非处长
		AppUser appuser=appuserService.get(Long.valueOf(userId));
		Set<AppRole> roles = appuser.getRoles();
		boolean isofficeDeputyDirector = false;
		for (AppRole role : roles) {
			if ((role.getRoleId().toString().equals(officeDeputyDirectorRoleID
					.getDataValue())||role.getRoleId().toString().equals(officeDirectorRoleID
							.getDataValue())))
				isofficeDeputyDirector = true;
			}
		jsonString = "{success:"+isofficeDeputyDirector +"}";
		return SUCCESS;
	}
	/**
	 * 删除信息
	 * 
	 * @return
	 */
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("ids");
		OutPerson outPerson = null;
		if (ids != null) {
			for (String id : ids) {
				outPerson = outPersonService.get(new Long(id));
				if (null == outPerson)
					continue;
				outPerson.setDeleted("1");
				outPerson.setUpdateDate(new Date());
				outPerson.setUpdateUser(ContextUtil.getCurrentUser()
						.getUsername());
				outPersonService.save(outPerson);
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}

	public String recover() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				outPersonService.remove(new Long(id));
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		OutPerson lead = outPersonService.get(Id);
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate",
				"updateDate");
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.include("appUser.fullname")
				.exclude(new String[] { "class", "appUser" }).serialize(lead));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	public OutPersonService getOutPersonService() {
		return outPersonService;
	}

	public void setOutPersonService(OutPersonService outPersonService) {
		this.outPersonService = outPersonService;
	}

	public OutPerson getOutPerson() {
		return outPerson;
	}

	public void setOutPerson(OutPerson outPerson) {
		this.outPerson = outPerson;
	}

	public Long getId() {
		return Id;
	}

	public void setId(Long id) {
		Id = id;
	}
}
