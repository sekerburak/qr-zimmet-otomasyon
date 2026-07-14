import prisma from '../config/database';

export async function assignAsset(
  assetId: number,
  userId: number,
  adminId: number,
  ipAddress?: string
) {

  const asset = await prisma.asset.findUnique({
    where: { id: assetId }
  });

  if (!asset) {
    throw new Error("Demirbaş bulunamadı");
  }

  const assignment = await prisma.assignment.create({
    data: {
      assetId,
      userId
    }
  });

  await prisma.asset.update({
    where: { id: assetId },
    data: {
      status: "ASSIGNED"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: adminId,
      action: "ASSIGN_ASSET",
      entity: "Assignment",
      entityId: assignment.id,
      ipAddress
    }
  });

  return assignment;
}

export async function returnAsset(
  assignmentId: number,
  adminId: number,
  ipAddress?: string
) {

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId
    }
  });


  if (!assignment) {
    throw new Error("Zimmet kaydı bulunamadı");
  }


  if (assignment.status !== "ACTIVE") {
    throw new Error("Bu zimmet zaten kapatılmış");
  }


  const updatedAssignment = await prisma.assignment.update({

    where: {
      id: assignmentId
    },

    data: {
      status: "RETURNED",
      returnDate: new Date()
    }

  });


  await prisma.asset.update({

    where:{
      id: assignment.assetId
    },

    data:{
      status:"ACTIVE"
    }

  });


  await prisma.auditLog.create({

    data:{
      userId: adminId,
      action:"RETURN_ASSET",
      entity:"Assignment",
      entityId:assignmentId,
      ipAddress
    }

  });


  return updatedAssignment;

}