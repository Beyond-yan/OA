package com.gdssoft.oa.action.archive;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.lang.StringUtils;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.ArchivesHandle;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesHandleService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;

import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class ArchivesHandleAction extends BaseAction {
	@Resource
	private ArchivesHandleService archivesHandleService;
	private ArchivesHandle archivesHandle;
	@Resource
	private ArchivesService archivesService;
//	@Resource
//	private MonitorApplyService monitorApplyService;

	@Resource
	private AppUserService appUserService;

//	@Resource
//	private RollFileService rollFileService;

	@Resource
	private ArchivesDocService archivesDocService;
	private Long handleId;
	private String handleOpinion;
	private Short isPass;
	private Long archiveId;
	private Short isHandle;
	private String recDepIds;

	public Long getArchiveId() {
		return archiveId;
	}

	public void setArchiveId(Long archiveId) {
		this.archiveId = archiveId;
	}

	public String getHandleOpinion() {
		return handleOpinion;
	}

	public void setHandleOpinion(String handleOpinion) {
		this.handleOpinion = handleOpinion;
	}

	public Short getIsPass() {
		return isPass;
	}

	public void setIsPass(Short isPass) {
		this.isPass = isPass;
	}

	public Long getHandleId() {
		return handleId;
	}

	public void setHandleId(Long handleId) {
		this.handleId = handleId;
	}

	public ArchivesHandle getArchivesHandle() {
		return archivesHandle;
	}

	public void setArchivesHandle(ArchivesHandle archivesHandle) {
		this.archivesHandle = archivesHandle;
	}

	public Short getIsHandle() {
		return isHandle;
	}

	public void setIsHandle(Short isHandle) {
		this.isHandle = isHandle;
	}

	public String getRecDepIds() {
		return recDepIds;
	}

	public void setRecDepIds(String recDepIds) {
		this.recDepIds = recDepIds;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_userId_L_EQ", ContextUtil.getCurrentUserId()
				.toString());
		// filter.addFilter("Q_isPass_SN_EQ","1");
		// filter.addFilter("Q_archives.status_SN_EQ","1");
		List<ArchivesHandle> list = archivesHandleService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = JsonUtil.getJSONSerializer("createtime",
				"archives.issueDate", "archives.createtime");
		buff.append(serializer.exclude(
				new String[] { "archives.archRecType", "class" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				archivesHandleService.remove(new Long(id));
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
		ArchivesHandle archivesHandle = archivesHandleService.get(handleId);

		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archivesHandle));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		String archivesStatus = getRequest().getParameter("archivesStatus");
		ArchivesHandle arh = new ArchivesHandle();
		AppUser user = ContextUtil.getCurrentUser();
		System.out.println("-----------archiveId-----------" + archiveId);
		Archives archives = archivesService.get(archiveId);
		if(StringUtils.isNotEmpty(archivesStatus)){
			archives.setStatus(Short.parseShort(archivesStatus));
		}
		arh.setArchives(archives);
		arh.setCreatetime(new Date());
		arh.setFillTime(new Date());
		arh.setHandleOpinion(handleOpinion);
		arh.setIsPass(isPass);
		arh.setUserId(user.getUserId());
		arh.setUserFullname(user.getFullname());
		archivesHandleService.save(arh);
		String option = getRequest().getParameter("option");
		String signIds = getRequest().getParameter("handlerUserIds");
		if (option != null) {
			// 进行督办
			if (option.equals("pass") || option == "pass") {
				if (isHandle == 1) {
					String depIds[] = recDepIds.split(",");
					for (String did : depIds) {
						// 获取部门综合管理员
						List<AppUser> li = appUserService.findUserByDepandRole(
								new Long(24), new Long(did));
						// 获取部门主管
						List<AppUser> list = appUserService
								.findUserByDepandRole(new Long(23), new Long(
										did));
						Long applicantId = li.get(0).getUserId();
						String topic = "公文督办:" + archives.getSubject();
						String description = "公文简介:"
								+ archives.getShortContent();
						String monitorDepartmentTemp = li.get(0)
								.getDepartment().getDepName();
						String flowAssignId = list.get(0).getUserId()
								.toString();
//						boolean result = monitorApplyService.startMointorApply(
//								applicantId, topic, description, null, "0",
//								"0", monitorDepartmentTemp, null, flowAssignId,
//								did, "0");
//						System.out
//								.println("--------------result---------------"
//										+ result);
					}
				}
				// 进行归档
				int archType = archives.getOdFlowtype().getIsAutoSave();
				if (archType == 1) {
					AppUser currentUser = ContextUtil.getCurrentUser();
					List<ArchivesDoc> arDocList = archivesDocService
							.findByAid(archiveId);
					List<FileAttach> attachList = new ArrayList<FileAttach>();
					for (ArchivesDoc archivesDoc : arDocList) {
						attachList.add(archivesDoc.getFileAttach());
					}
//					RollFile rollFile = new RollFile();
//					rollFile.setFileName(archives.getSubject());
//					rollFile.setTidyName(currentUser.getFullname());
//					rollFile.setTidyTime(new Date());
//					rollFileService.autoTidy(rollFile, attachList);
					archives.setStatus((short)7);
				}
			}
		}
		String ccIds = getRequest().getParameter("ccIds");
        System.out.println("---------ccIds-----------"+ccIds);
		java.util.Set<AppUser> archivesCCs = new java.util.HashSet<AppUser>();
		if (!("".equals(ccIds) || null == ccIds)) {
			String[] ccIdsArray = ccIds.split(",");
			AppUser appUser = new AppUser();
			for (int i = 0; i < ccIdsArray.length; i++) {
				System.out.println("---------i-----------"+ccIdsArray[i]);
				appUser = appUserService.get(new Long(ccIdsArray[i]));
				archivesCCs.add(appUser);
			}
		}
		if (!archivesCCs.isEmpty()) {
			archives.setArchivesCCs(archivesCCs);
		}
		archivesService.save(archives);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
